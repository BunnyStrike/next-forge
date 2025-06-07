import { v4 as uuidv4 } from 'uuid'
import type {
  UploadAdapter,
  UploadOptions,
  UploadResult,
  UploadThingConfig,
} from '../types'
import { extractFileMetadata, generateThumbnail } from '../utils'

export class UploadThingAdapter implements UploadAdapter {
  private config: UploadThingConfig
  private baseUrl: string

  constructor(config: UploadThingConfig) {
    this.config = config
    this.baseUrl = config.endpoint || '/api/uploadthing'
  }

  async upload(file: File, options?: UploadOptions): Promise<UploadResult> {
    try {
      const metadata = await extractFileMetadata(file)

      // Create FormData for UploadThing upload
      const formData = new FormData()
      formData.append('files', file)

      if (options?.folder) {
        formData.append('folder', options.folder)
      }

      if (options?.fileName) {
        formData.append('fileName', options.fileName)
      }

      // Upload to UploadThing
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'X-Uploadthing-Api-Key': this.config.apiKey,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `UploadThing API error: ${response.status} - ${errorText}`
        )
      }

      const uploadResult = await response.json()

      // UploadThing typically returns an array of files
      const uploadedFile = Array.isArray(uploadResult)
        ? uploadResult[0]
        : uploadResult

      if (!uploadedFile?.url) {
        throw new Error('Invalid response from UploadThing API')
      }

      const result: UploadResult = {
        url: uploadedFile.url,
        metadata,
      }

      // Generate thumbnail if requested and file is an image
      if (options?.generateThumbnail && metadata.fileType === 'image') {
        try {
          const thumbnailDataUrl = await generateThumbnail(file)
          const thumbnailFileName = `thumb_${uuidv4()}.jpg`

          // Convert data URL to blob
          const response = await fetch(thumbnailDataUrl)
          const thumbnailBlob = await response.blob()
          const thumbnailFile = new File([thumbnailBlob], thumbnailFileName, {
            type: 'image/jpeg',
          })

          // Upload thumbnail
          const thumbnailFormData = new FormData()
          thumbnailFormData.append('files', thumbnailFile)
          if (options?.folder) {
            thumbnailFormData.append('folder', `${options.folder}/thumbnails`)
          }

          const thumbnailResponse = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
              'X-Uploadthing-Api-Key': this.config.apiKey,
            },
            body: thumbnailFormData,
          })

          if (thumbnailResponse.ok) {
            const thumbnailResult = await thumbnailResponse.json()
            const thumbnailFile = Array.isArray(thumbnailResult)
              ? thumbnailResult[0]
              : thumbnailResult
            result.thumbnailUrl = thumbnailFile?.url
          }
        } catch (error) {
          console.warn('Failed to generate thumbnail:', error)
        }
      }

      return result
    } catch (error) {
      throw new Error(
        `UploadThing upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  async delete(fileUrl: string): Promise<void> {
    try {
      // Extract file key from URL
      const fileKey = this.extractFileKeyFromUrl(fileUrl)

      const response = await fetch(`${this.baseUrl}/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Uploadthing-Api-Key': this.config.apiKey,
        },
        body: JSON.stringify({
          fileKeys: [fileKey],
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `UploadThing delete error: ${response.status} - ${errorText}`
        )
      }

      // Also try to delete thumbnail if it exists
      const thumbnailKey = this.getThumbnailKey(fileKey)
      if (thumbnailKey) {
        try {
          await fetch(`${this.baseUrl}/delete`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Uploadthing-Api-Key': this.config.apiKey,
            },
            body: JSON.stringify({
              fileKeys: [thumbnailKey],
            }),
          })
        } catch (error) {
          // Thumbnail might not exist, ignore error
        }
      }
    } catch (error) {
      throw new Error(
        `UploadThing delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  private extractFileKeyFromUrl(url: string): string {
    try {
      // UploadThing URLs typically have the format: https://uploadthing.com/f/{fileKey}
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split('/')
      return pathParts[pathParts.length - 1]
    } catch {
      // Fallback: use the entire URL as the key
      return url
    }
  }

  private getThumbnailKey(originalKey: string): string | null {
    // This is a simplified approach - in practice, you'd need to track thumbnail keys
    // or use a predictable naming convention
    if (originalKey.startsWith('thumb_')) {
      return null // This is already a thumbnail
    }
    return `thumb_${originalKey.replace(/\.[^/.]+$/, '.jpg')}`
  }
}
