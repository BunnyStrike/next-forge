'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, Image, Video, Music, Archive } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@repo/design-system/lib/utils'
import type { DraggerConfig, FileType } from '../lib/types'
import { getFileType, formatFileSize } from '../lib/utils'

interface UploadDropzoneProps extends DraggerConfig {
  isDragActive?: boolean
  loading?: boolean
  error?: string
}

const getFileIcon = (fileType: FileType) => {
  switch (fileType) {
    case 'image':
      return Image
    case 'video':
      return Video
    case 'audio':
      return Music
    case 'archive':
      return Archive
    default:
      return FileText
  }
}

export const UploadDropzone = ({
  maxFiles = 10,
  acceptedFileTypes = ['image/*', 'application/pdf'],
  disabled = false,
  className,
  children,
  onDrop,
  onReject,
  loading = false,
  error,
}: UploadDropzoneProps) => {
  const handleDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (acceptedFiles.length > 0) {
        onDrop?.(acceptedFiles)
      }

      if (rejectedFiles.length > 0) {
        onReject?.(rejectedFiles.map((rejection: any) => rejection.file))
      }
    },
    [onDrop, onReject]
  )

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop: handleDrop,
    accept: acceptedFileTypes.reduce(
      (acc, type) => {
        acc[type] = []
        return acc
      },
      {} as Record<string, string[]>
    ),
    maxFiles,
    disabled: disabled || loading,
    multiple: maxFiles > 1,
  })

  const dropzoneVariants = {
    idle: {
      borderColor: 'rgb(226 232 240)', // slate-200
      backgroundColor: 'rgb(248 250 252)', // slate-50
    },
    dragActive: {
      borderColor: 'rgb(59 130 246)', // blue-500
      backgroundColor: 'rgb(239 246 255)', // blue-50
      scale: 1.02,
    },
    dragAccept: {
      borderColor: 'rgb(34 197 94)', // green-500
      backgroundColor: 'rgb(240 253 244)', // green-50
    },
    dragReject: {
      borderColor: 'rgb(239 68 68)', // red-500
      backgroundColor: 'rgb(254 242 242)', // red-50
    },
  }

  const getVariant = () => {
    if (isDragReject) return 'dragReject'
    if (isDragAccept) return 'dragAccept'
    if (isDragActive) return 'dragActive'
    return 'idle'
  }

  if (children) {
    return (
      <div {...getRootProps()} className={className}>
        <input {...getInputProps()} />
        {children}
      </div>
    )
  }

  const {
    onAnimationStart,
    onAnimationEnd,
    onDrag,
    onDragStart,
    onDragEnd,
    ...rootProps
  } = getRootProps()

  return (
    <motion.div
      {...rootProps}
      className={cn(
        'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      variants={dropzoneVariants}
      animate={getVariant()}
      whileHover={!disabled ? { scale: 1.01 } : undefined}
      whileTap={!disabled ? { scale: 0.99 } : undefined}
    >
      <input {...getInputProps()} />

      <AnimatePresence mode='wait'>
        {loading ? (
          <motion.div
            key='loading'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='flex flex-col items-center space-y-2'
          >
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600' />
            <p className='text-sm text-gray-600'>Processing files...</p>
          </motion.div>
        ) : error ? (
          <motion.div
            key='error'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='flex flex-col items-center space-y-2'
          >
            <div className='rounded-full bg-red-100 p-3'>
              <FileText className='h-6 w-6 text-red-600' />
            </div>
            <p className='text-sm text-red-600'>{error}</p>
          </motion.div>
        ) : (
          <motion.div
            key='default'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='flex flex-col items-center space-y-4'
          >
            <motion.div
              className={cn(
                'rounded-full p-4',
                isDragActive
                  ? isDragAccept
                    ? 'bg-green-100'
                    : isDragReject
                      ? 'bg-red-100'
                      : 'bg-blue-100'
                  : 'bg-gray-100'
              )}
              animate={{
                scale: isDragActive ? 1.1 : 1,
                rotate: isDragActive ? 5 : 0,
              }}
            >
              <Upload
                className={cn(
                  'h-8 w-8',
                  isDragActive
                    ? isDragAccept
                      ? 'text-green-600'
                      : isDragReject
                        ? 'text-red-600'
                        : 'text-blue-600'
                    : 'text-gray-600'
                )}
              />
            </motion.div>

            <div className='space-y-2'>
              <p className='text-lg font-medium text-gray-900'>
                {isDragActive
                  ? isDragAccept
                    ? 'Drop files here'
                    : 'Some files are not supported'
                  : 'Drop files here or click to browse'}
              </p>

              <div className='text-sm text-gray-500 space-y-1'>
                <p>Supports: {acceptedFileTypes.join(', ')}</p>
                {maxFiles > 1 && <p>Maximum {maxFiles} files</p>}
              </div>
            </div>

            {acceptedFileTypes.length > 0 && (
              <div className='flex space-x-2'>
                {acceptedFileTypes.slice(0, 4).map((type, index) => {
                  const fileType = getFileType(type)
                  const IconComponent = getFileIcon(fileType)

                  return (
                    <motion.div
                      key={type}
                      className='flex flex-col items-center space-y-1'
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className='rounded-lg bg-white p-2 shadow-sm border'>
                        <IconComponent className='h-4 w-4 text-gray-600' />
                      </div>
                      <span className='text-xs text-gray-500 capitalize'>
                        {fileType}
                      </span>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
