'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { cn } from '@repo/design-system/lib/utils';
import { UploadDropzone } from './upload-dropzone';
import { FilePreview } from './file-preview';
import { useUpload } from '../hooks/use-upload';
import type { UploadConfig, UploadAdapter } from '../lib/types';

interface UploadManagerProps {
  adapter?: UploadAdapter;
  config?: UploadConfig;
  className?: string;
  onFilesChange?: (files: any[]) => void;
  onUploadComplete?: (files: any[]) => void;
  onError?: (error: string) => void;
}

export const UploadManager = ({
  adapter,
  config,
  className,
  onFilesChange,
  onUploadComplete,
  onError,
}: UploadManagerProps) => {
  const {
    files,
    isUploading,
    addFiles,
    removeFile,
    uploadAll,
    clearFiles,
    retryFile,
    totalFiles,
    successfulUploads,
    failedUploads,
    pendingUploads,
    activeUploads,
  } = useUpload({
    adapter,
    config,
    onSuccess: (file) => {
      onFilesChange?.(files);
      if (successfulUploads === totalFiles - 1) {
        onUploadComplete?.(files.filter(f => f.status === 'success'));
      }
    },
    onError: (file, error) => {
      onFilesChange?.(files);
      onError?.(error);
    },
    onProgress: (file, progress) => {
      onFilesChange?.(files);
    },
  });

  const handleDrop = (newFiles: File[]) => {
    addFiles(newFiles);
  };

  const handleReject = (rejectedFiles: File[]) => {
    onError?.(`${rejectedFiles.length} file(s) were rejected`);
  };

  const canUpload = pendingUploads > 0 && !isUploading && adapter;
  const hasFiles = totalFiles > 0;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Dropzone */}
      <UploadDropzone
        maxFiles={config?.maxFiles}
        acceptedFileTypes={config?.acceptedFileTypes}
        disabled={isUploading}
        onDrop={handleDrop}
        onReject={handleReject}
        loading={isUploading && activeUploads === 0}
      />

      {/* Upload Statistics */}
      {hasFiles && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
          <div className="flex space-x-4">
            <span className="text-gray-600">
              Total: <span className="font-medium">{totalFiles}</span>
            </span>
            {successfulUploads > 0 && (
              <span className="text-green-600">
                Uploaded: <span className="font-medium">{successfulUploads}</span>
              </span>
            )}
            {failedUploads > 0 && (
              <span className="text-red-600">
                Failed: <span className="font-medium">{failedUploads}</span>
              </span>
            )}
            {pendingUploads > 0 && (
              <span className="text-blue-600">
                Pending: <span className="font-medium">{pendingUploads}</span>
              </span>
            )}
            {activeUploads > 0 && (
              <span className="text-blue-600">
                Uploading: <span className="font-medium">{activeUploads}</span>
              </span>
            )}
          </div>
          
          <div className="flex space-x-2">
            {canUpload && (
              <Button
                onClick={uploadAll}
                size="sm"
                disabled={isUploading}
              >
                Upload All ({pendingUploads})
              </Button>
            )}
            
            {hasFiles && (
              <Button
                onClick={clearFiles}
                variant="outline"
                size="sm"
                disabled={isUploading}
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
      )}

      {/* File List */}
      {hasFiles && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-900">
            Files ({totalFiles})
          </h3>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {files.map((file) => (
              <FilePreview
                key={file.id}
                file={file}
                onRemove={removeFile}
                onRetry={retryFile}
                showProgress={true}
                showThumbnail={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!hasFiles && !isUploading && (
        <div className="text-center py-8 text-gray-500">
          <p>No files selected</p>
          <p className="text-sm">Drag and drop files or click to browse</p>
        </div>
      )}
    </div>
  );
}; 