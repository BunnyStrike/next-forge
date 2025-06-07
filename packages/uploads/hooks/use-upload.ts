'use client'

import { useState, useCallback, useRef } from 'react'
import type {
  UploadFile,
  UploadConfig,
  UploadAdapter,
  UploadOptions,
} from '../lib/types'
import {
  extractFileMetadata,
  validateFile,
  generateFileId,
  resizeImage,
} from '../lib/utils'

interface UseUploadOptions {
  adapter?: UploadAdapter
  config?: UploadConfig
  onSuccess?: (file: UploadFile) => void
  onError?: (file: UploadFile, error: string) => void
  onProgress?: (file: UploadFile, progress: number) => void
}

const DEFAULT_CONFIG: UploadConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 10,
  acceptedFileTypes: ['image/*', 'application/pdf'],
  autoUpload: false,
  generateThumbnails: true,
  resizeImages: false,
  compressionQuality: 0.8,
  maxWidth: 1920,
  maxHeight: 1080,
  storageProvider: 'local',
}

export const useUpload = (options: UseUploadOptions = {}) => {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map())

  const config = { ...DEFAULT_CONFIG, ...options.config }

  const addFiles = useCallback(
    async (newFiles: File[]) => {
      const currentFileCount = files.length
      const maxFiles = config.maxFiles || Infinity

      // Check if adding these files would exceed the limit
      if (currentFileCount + newFiles.length > maxFiles) {
        const allowedCount = maxFiles - currentFileCount
        newFiles = newFiles.slice(0, allowedCount)
      }

      const uploadFiles: UploadFile[] = []

      for (const file of newFiles) {
        const validation = validateFile(file, config)

        if (!validation.valid) {
          // Create file with error state
          const uploadFile: UploadFile = {
            id: generateFileId(),
            file,
            status: 'error',
            progress: 0,
            error: validation.error,
          }
          uploadFiles.push(uploadFile)
          continue
        }

        try {
          let processedFile = file

          // Resize image if needed
          if (config.resizeImages && file.type.startsWith('image/')) {
            const { maxWidth, maxHeight, compressionQuality } = config
            if (maxWidth && maxHeight) {
              processedFile = await resizeImage(
                file,
                maxWidth,
                maxHeight,
                compressionQuality
              )
            }
          }

          const metadata = await extractFileMetadata(processedFile)

          const uploadFile: UploadFile = {
            id: generateFileId(),
            file: processedFile,
            status: 'idle',
            progress: 0,
            metadata,
          }

          uploadFiles.push(uploadFile)
        } catch (error) {
          const uploadFile: UploadFile = {
            id: generateFileId(),
            file,
            status: 'error',
            progress: 0,
            error:
              error instanceof Error ? error.message : 'Failed to process file',
          }
          uploadFiles.push(uploadFile)
        }
      }

      setFiles(prev => [...prev, ...uploadFiles])

      // Auto upload if enabled
      if (config.autoUpload && options.adapter) {
        for (const uploadFile of uploadFiles) {
          if (uploadFile.status === 'idle') {
            uploadFile.status = 'uploading'
            uploadSingleFile(uploadFile)
          }
        }
      }
    },
    [files, config, options.adapter]
  )

  const updateFile = useCallback((id: string, updates: Partial<UploadFile>) => {
    setFiles(prev =>
      prev.map(file => (file.id === id ? { ...file, ...updates } : file))
    )
  }, [])

  const uploadSingleFile = useCallback(
    async (uploadFile: UploadFile) => {
      if (!options.adapter) {
        updateFile(uploadFile.id, {
          status: 'error',
          error: 'No upload adapter configured',
        })
        options.onError?.(uploadFile, 'No upload adapter configured')
        return
      }

      const abortController = new AbortController()
      abortControllersRef.current.set(uploadFile.id, abortController)

      try {
        updateFile(uploadFile.id, { status: 'uploading', progress: 0 })

        // Simulate progress updates (in real implementation, this would come from the adapter)
        const progressInterval = setInterval(() => {
          setFiles(prev => {
            const file = prev.find(f => f.id === uploadFile.id)
            if (file && file.status === 'uploading' && file.progress < 90) {
              const newProgress = Math.min(
                file.progress + Math.random() * 20,
                90
              )
              options.onProgress?.(file, newProgress)
              return prev.map(f =>
                f.id === uploadFile.id ? { ...f, progress: newProgress } : f
              )
            }
            return prev
          })
        }, 500)

        const uploadOptions: UploadOptions = {
          generateThumbnail: config.generateThumbnails,
          folder: 'uploads',
        }

        const result = await options.adapter.upload(
          uploadFile.file,
          uploadOptions
        )

        clearInterval(progressInterval)
        abortControllersRef.current.delete(uploadFile.id)

        const updatedFile = {
          ...uploadFile,
          status: 'success' as const,
          progress: 100,
          url: result.url,
          thumbnailUrl: result.thumbnailUrl,
          metadata: result.metadata,
        }

        updateFile(uploadFile.id, updatedFile)
        options.onSuccess?.(updatedFile)
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Upload failed'

        updateFile(uploadFile.id, {
          status: 'error',
          error: errorMessage,
        })

        options.onError?.(uploadFile, errorMessage)
      } finally {
        abortControllersRef.current.delete(uploadFile.id)
      }
    },
    [options, config, updateFile]
  )

  const uploadFile = useCallback(
    async (id: string) => {
      const file = files.find(f => f.id === id)
      if (!file || file.status !== 'idle') return

      await uploadSingleFile(file)
    },
    [files, uploadSingleFile]
  )

  const uploadAll = useCallback(async () => {
    const idleFiles = files.filter(f => f.status === 'idle')
    if (idleFiles.length === 0) return

    setIsUploading(true)

    try {
      await Promise.all(idleFiles.map(file => uploadSingleFile(file)))
    } finally {
      setIsUploading(false)
    }
  }, [files, uploadSingleFile])

  const removeFile = useCallback((id: string) => {
    // Cancel upload if in progress
    const abortController = abortControllersRef.current.get(id)
    if (abortController) {
      abortController.abort()
      abortControllersRef.current.delete(id)
    }

    setFiles(prev => prev.filter(f => f.id !== id))
  }, [])

  const retryFile = useCallback(
    (id: string) => {
      const file = files.find(f => f.id === id)
      if (!file || file.status !== 'error') return

      updateFile(id, { status: 'idle', error: undefined })
    },
    [files, updateFile]
  )

  const clearFiles = useCallback(() => {
    // Cancel all ongoing uploads
    abortControllersRef.current.forEach(controller => controller.abort())
    abortControllersRef.current.clear()

    setFiles([])
    setIsUploading(false)
  }, [])

  const getFileById = useCallback(
    (id: string) => {
      return files.find(f => f.id === id)
    },
    [files]
  )

  const getFilesByStatus = useCallback(
    (status: UploadFile['status']) => {
      return files.filter(f => f.status === status)
    },
    [files]
  )

  return {
    files,
    config,
    isUploading,
    addFiles,
    removeFile,
    uploadFile,
    uploadAll,
    retryFile,
    clearFiles,
    getFileById,
    getFilesByStatus,
    // Statistics
    totalFiles: files.length,
    successfulUploads: files.filter(f => f.status === 'success').length,
    failedUploads: files.filter(f => f.status === 'error').length,
    pendingUploads: files.filter(f => f.status === 'idle').length,
    activeUploads: files.filter(f => f.status === 'uploading').length,
  }
}
