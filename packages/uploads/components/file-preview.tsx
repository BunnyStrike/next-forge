'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, RefreshCw, Check, AlertCircle, Eye, Download, FileText, Image, Video, Music, Archive } from 'lucide-react';
import { cn } from '@repo/design-system/lib/utils';
import type { FilePreviewProps, FileType } from '../lib/types';
import { formatFileSize } from '../lib/utils';

const getFileIcon = (fileType: FileType, size = 'h-6 w-6') => {
  const iconProps = { className: `${size} text-gray-600` };
  
  switch (fileType) {
    case 'image':
      return <Image {...iconProps} />;
    case 'video':
      return <Video {...iconProps} />;
    case 'audio':
      return <Music {...iconProps} />;
    case 'archive':
      return <Archive {...iconProps} />;
    default:
      return <FileText {...iconProps} />;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success':
      return <Check className="h-4 w-4 text-green-600" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    case 'uploading':
      return <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />;
    default:
      return null;
  }
};

export const FilePreview = ({
  file,
  onRemove,
  onRetry,
  showProgress = true,
  showThumbnail = true,
  className,
}: FilePreviewProps) => {
  const [imageError, setImageError] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);

  const isImage = file.metadata?.fileType === 'image';
  const canShowThumbnail = showThumbnail && isImage && !imageError;
  const thumbnailUrl = file.thumbnailUrl || (isImage ? URL.createObjectURL(file.file) : null);

  const handleImageError = () => {
    setImageError(true);
  };

  const handlePreview = () => {
    if (file.url) {
      window.open(file.url, '_blank');
    } else if (isImage) {
      setShowFullPreview(true);
    }
  };

  const handleDownload = () => {
    if (file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.metadata?.originalName || file.file.name;
      link.click();
    }
  };

  return (
    <>
      <motion.div
        className={cn(
          'relative flex items-center space-x-3 rounded-lg border p-3 transition-colors',
          file.status === 'success' && 'border-green-200 bg-green-50',
          file.status === 'error' && 'border-red-200 bg-red-50',
          file.status === 'uploading' && 'border-blue-200 bg-blue-50',
          file.status === 'idle' && 'border-gray-200 bg-white',
          className
        )}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        layout
      >
        {/* File Icon/Thumbnail */}
        <div className="flex-shrink-0">
          {canShowThumbnail ? (
            <div className="relative h-12 w-12 overflow-hidden rounded-lg border">
              <img
                src={thumbnailUrl!}
                alt={file.file.name}
                className="h-full w-full object-cover"
                onError={handleImageError}
              />
              {file.status === 'uploading' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-gray-50">
              {getFileIcon(file.metadata?.fileType || 'other')}
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                {file.metadata?.originalName || file.file.name}
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{formatFileSize(file.file.size)}</span>
                {file.metadata?.width && file.metadata?.height && (
                  <span>• {file.metadata.width}×{file.metadata.height}</span>
                )}
                {file.metadata?.duration && (
                  <span>• {Math.round(file.metadata.duration)}s</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              {getStatusIcon(file.status)}
            </div>
          </div>

          {/* Progress Bar */}
          {showProgress && file.status === 'uploading' && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Uploading...</span>
                <span>{Math.round(file.progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <motion.div
                  className="bg-blue-600 h-1.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${file.progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {file.status === 'error' && file.error && (
            <div className="mt-2">
              <p className="text-xs text-red-600">{file.error}</p>
            </div>
          )}

          {/* Success Actions */}
          {file.status === 'success' && file.url && (
            <div className="mt-2 flex space-x-2">
              <button
                onClick={handlePreview}
                className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700"
              >
                <Eye className="h-3 w-3" />
                <span>Preview</span>
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700"
              >
                <Download className="h-3 w-3" />
                <span>Download</span>
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-1">
          {file.status === 'error' && onRetry && (
            <button
              onClick={() => onRetry(file.id)}
              className="flex items-center justify-center h-8 w-8 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50"
              title="Retry upload"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
          
          {onRemove && (
            <button
              onClick={() => onRemove(file.id)}
              className="flex items-center justify-center h-8 w-8 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50"
              title="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Full Preview Modal */}
      {showFullPreview && isImage && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowFullPreview(false)}
        >
          <motion.div
            className="relative max-h-full max-w-full p-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={file.url || URL.createObjectURL(file.file)}
              alt={file.file.name}
              className="max-h-full max-w-full rounded-lg"
            />
            <button
              onClick={() => setShowFullPreview(false)}
              className="absolute top-2 right-2 flex items-center justify-center h-8 w-8 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}; 