import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuidv4 } from 'uuid'
import type {
  UploadAdapter,
  UploadOptions,
  UploadResult,
  S3Config,
} from '../types'
import { extractFileMetadata, generateThumbnail } from '../utils'

export class S3Adapter implements UploadAdapter {
  private client: S3Client
  private bucket: string
  private baseUrl?: string

  constructor(config: S3Config) {
    this.client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      endpoint: config.endpoint,
    })

    this.bucket = config.bucket
    this.baseUrl =
      config.endpoint ||
      `https://${config.bucket}.s3.${config.region}.amazonaws.com`
  }

  async upload(file: File, options?: UploadOptions): Promise<UploadResult> {
    try {
      const metadata = await extractFileMetadata(file)
      const fileKey = this.generateFileKey(file, options)

      // Upload main file
      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
        Body: file,
        ContentType: file.type,
        Metadata: {
          originalName: metadata.originalName,
          size: metadata.size.toString(),
          fileType: metadata.fileType,
        },
      })

      await this.client.send(uploadCommand)
      const url = `${this.baseUrl}/${fileKey}`

      const result: UploadResult = {
        url,
        metadata,
      }

      // Generate thumbnail if requested and file is an image
      if (options?.generateThumbnail && metadata.fileType === 'image') {
        try {
          const thumbnailDataUrl = await generateThumbnail(file)
          const thumbnailKey = `${fileKey.replace(/\.[^/.]+$/, '')}_thumb.jpg`

          // Convert data URL to blob
          const response = await fetch(thumbnailDataUrl)
          const thumbnailBlob = await response.blob()

          const thumbnailCommand = new PutObjectCommand({
            Bucket: this.bucket,
            Key: thumbnailKey,
            Body: thumbnailBlob,
            ContentType: 'image/jpeg',
          })

          await this.client.send(thumbnailCommand)
          result.thumbnailUrl = `${this.baseUrl}/${thumbnailKey}`
        } catch (error) {
          console.warn('Failed to generate thumbnail:', error)
        }
      }

      return result
    } catch (error) {
      throw new Error(
        `S3 upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  async delete(fileUrl: string): Promise<void> {
    try {
      const fileKey = this.extractKeyFromUrl(fileUrl)

      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
      })

      await this.client.send(deleteCommand)

      // Also try to delete thumbnail if it exists
      const thumbnailKey = `${fileKey.replace(/\.[^/.]+$/, '')}_thumb.jpg`
      try {
        const deleteThumbnailCommand = new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: thumbnailKey,
        })
        await this.client.send(deleteThumbnailCommand)
      } catch (error) {
        // Thumbnail might not exist, ignore error
      }
    } catch (error) {
      throw new Error(
        `S3 delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  async generatePresignedUrl(
    fileKey: string,
    expiresIn = 3600
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
    })

    return getSignedUrl(this.client, command, { expiresIn })
  }

  private generateFileKey(file: File, options?: UploadOptions): string {
    const timestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    const uniqueId = uuidv4()
    const extension = file.name.split('.').pop() || ''

    let fileName = options?.fileName || `${uniqueId}.${extension}`
    if (!fileName.includes('.') && extension) {
      fileName = `${fileName}.${extension}`
    }

    const folder = options?.folder || 'uploads'
    return `${folder}/${timestamp}/${fileName}`
  }

  private extractKeyFromUrl(url: string): string {
    if (url.includes(this.baseUrl || '')) {
      return url.split('/').slice(-3).join('/') // folder/date/filename
    }

    // Fallback: assume the path after domain is the key
    const urlObj = new URL(url)
    return urlObj.pathname.slice(1) // Remove leading slash
  }
}
