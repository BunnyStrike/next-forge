import type { FileType, FileMetadata } from './types'

/**
 * Convert bytes to human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Determine file type from MIME type
 */
export const getFileType = (mimeType: string): FileType => {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'

  const documentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'application/json',
  ]

  if (documentTypes.includes(mimeType)) return 'document'

  const archiveTypes = [
    'application/zip',
    'application/x-rar-compressed',
    'application/x-tar',
    'application/gzip',
    'application/x-7z-compressed',
  ]

  if (archiveTypes.includes(mimeType)) return 'archive'

  return 'other'
}

/**
 * Extract file metadata from File object
 */
export const extractFileMetadata = async (
  file: File
): Promise<FileMetadata> => {
  const metadata: FileMetadata = {
    originalName: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    fileType: getFileType(file.type),
  }

  // Get image dimensions if it's an image
  if (metadata.fileType === 'image') {
    try {
      const dimensions = await getImageDimensions(file)
      metadata.width = dimensions.width
      metadata.height = dimensions.height
    } catch (error) {
      console.warn('Failed to get image dimensions:', error)
    }
  }

  // Get video/audio duration
  if (metadata.fileType === 'video' || metadata.fileType === 'audio') {
    try {
      const duration = await getMediaDuration(file)
      metadata.duration = duration
    } catch (error) {
      console.warn('Failed to get media duration:', error)
    }
  }

  return metadata
}

/**
 * Get image dimensions
 */
export const getImageDimensions = (
  file: File
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      })
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to load image'))
    }

    img.src = objectUrl
  })
}

/**
 * Get media duration (video/audio)
 */
export const getMediaDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const media = document.createElement(
      file.type.startsWith('video/') ? 'video' : 'audio'
    )
    const objectUrl = URL.createObjectURL(file)

    media.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(media.duration)
    }

    media.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to load media'))
    }

    media.src = objectUrl
  })
}

/**
 * Validate file against config
 */
export const validateFile = (
  file: File,
  config: {
    maxFileSize?: number
    acceptedFileTypes?: string[]
  }
): { valid: boolean; error?: string } => {
  // Check file size
  if (config.maxFileSize && file.size > config.maxFileSize) {
    return {
      valid: false,
      error: `File size (${formatFileSize(file.size)}) exceeds maximum allowed size (${formatFileSize(config.maxFileSize)})`,
    }
  }

  // Check file type
  if (config.acceptedFileTypes && config.acceptedFileTypes.length > 0) {
    const isAccepted = config.acceptedFileTypes.some(acceptedType => {
      if (acceptedType.includes('*')) {
        // Handle wildcards like image/*
        const baseType = acceptedType.replace('*', '')
        return file.type.startsWith(baseType)
      }
      return file.type === acceptedType
    })

    if (!isAccepted) {
      return {
        valid: false,
        error: `File type (${file.type}) is not accepted. Allowed types: ${config.acceptedFileTypes.join(', ')}`,
      }
    }
  }

  return { valid: true }
}

/**
 * Generate unique file ID
 */
export const generateFileId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Create file preview URL
 */
export const createPreviewUrl = (file: File): string => {
  return URL.createObjectURL(file)
}

/**
 * Revoke file preview URL
 */
export const revokePreviewUrl = (url: string): void => {
  URL.revokeObjectURL(url)
}

/**
 * Resize image to fit within max dimensions
 */
export const resizeImage = (
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    if (!ctx) {
      reject(new Error('Failed to get canvas context'))
      return
    }

    img.onload = () => {
      const { width, height } = img

      // Calculate new dimensions
      let newWidth = width
      let newHeight = height

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        newWidth = width * ratio
        newHeight = height * ratio
      }

      canvas.width = newWidth
      canvas.height = newHeight

      // Draw resized image
      ctx.drawImage(img, 0, 0, newWidth, newHeight)

      // Convert to blob
      canvas.toBlob(
        blob => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            })
            resolve(resizedFile)
          } else {
            reject(new Error('Failed to resize image'))
          }
        },
        file.type,
        quality
      )
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Generate thumbnail for image
 */
export const generateThumbnail = (
  file: File,
  size = 150,
  quality = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    if (!ctx) {
      reject(new Error('Failed to get canvas context'))
      return
    }

    img.onload = () => {
      const { width, height } = img

      // Calculate thumbnail dimensions (square crop)
      const minDimension = Math.min(width, height)
      const scale = size / minDimension

      canvas.width = size
      canvas.height = size

      // Calculate crop position for center crop
      const sx = (width - minDimension) / 2
      const sy = (height - minDimension) / 2

      // Draw cropped and resized thumbnail
      ctx.drawImage(img, sx, sy, minDimension, minDimension, 0, 0, size, size)

      // Convert to data URL
      const dataUrl = canvas.toDataURL(file.type, quality)
      resolve(dataUrl)
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}
