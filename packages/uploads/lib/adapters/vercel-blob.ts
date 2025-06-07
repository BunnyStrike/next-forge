import { put, del } from '@vercel/blob'
import { v4 as uuidv4 } from 'uuid'
import type {
  UploadAdapter,
  UploadOptions,
  UploadResult,
  VercelBlobConfig,
} from '../types'
import { extractFileMetadata, generateThumbnail } from '../utils'

export class VercelBlobAdapter implements UploadAdapter {
  private config: VercelBlobConfig

  constructor(config: VercelBlobConfig) {
    this.config = config
  }

  async upload(file: File, options?: UploadOptions): Promise<UploadResult> {
    try {
      const metadata = await extractFileMetadata(file)
      const fileName = this.generateFileName(file, options)

      // Upload main file to Vercel Blob
      const blob = await put(fileName, file, {
        access: 'public',
        token: this.config.token,
        addRandomSuffix: this.config.addRandomSuffix ?? true,
      })

      const result: UploadResult = {
        url: blob.url,
        metadata,
      }

      // Generate thumbnail if requested and file is an image
      if (options?.generateThumbnail && metadata.fileType === 'image') {
        try {
          const thumbnailDataUrl = await generateThumbnail(file)
          const thumbnailFileName = `thumb_${fileName.replace(/\.[^/.]+$/, '.jpg')}`

          // Convert data URL to blob
          const response = await fetch(thumbnailDataUrl)
          const thumbnailBlob = await response.blob()
          const thumbnailFile = new File([thumbnailBlob], thumbnailFileName, {
            type: 'image/jpeg',
          })

          const thumbnailResult = await put(thumbnailFileName, thumbnailFile, {
            access: 'public',
            token: this.config.token,
            addRandomSuffix: this.config.addRandomSuffix ?? true,
          })

          result.thumbnailUrl = thumbnailResult.url
        } catch (error) {
          console.warn('Failed to generate thumbnail:', error)
        }
      }

      return result
    } catch (error) {
      throw new Error(
        `Vercel Blob upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  async delete(fileUrl: string): Promise<void> {
    try {
      await del(fileUrl, {
        token: this.config.token,
      })

      // Also try to delete thumbnail if it exists
      const thumbnailUrl = this.getThumbnailUrl(fileUrl)
      if (thumbnailUrl) {
        try {
          await del(thumbnailUrl, {
            token: this.config.token,
          })
        } catch (error) {
          // Thumbnail might not exist, ignore error
        }
      }
    } catch (error) {
      throw new Error(
        `Vercel Blob delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  private generateFileName(file: File, options?: UploadOptions): string {
    const timestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    const extension = file.name.split('.').pop() || ''

    let fileName = options?.fileName || file.name
    if (options?.fileName && !options.fileName.includes('.') && extension) {
      fileName = `${options.fileName}.${extension}`
    }

    const folder = options?.folder || 'uploads'
    return `${folder}/${timestamp}/${fileName}`
  }

  private getThumbnailUrl(originalUrl: string): string | null {
    try {
      const url = new URL(originalUrl)
      const pathParts = url.pathname.split('/')
      const fileName = pathParts[pathParts.length - 1]
      const thumbnailFileName = `thumb_${fileName.replace(/\.[^/.]+$/, '.jpg')}`

      pathParts[pathParts.length - 1] = thumbnailFileName
      url.pathname = pathParts.join('/')

      return url.toString()
    } catch {
      return null
    }
  }
}
