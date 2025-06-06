// Components
export { UploadDropzone } from './components/upload-dropzone';
export { FilePreview } from './components/file-preview';
export { UploadManager } from './components/upload-manager';

// Hooks
export { useUpload } from './hooks/use-upload';

// Adapters
export { S3Adapter } from './lib/adapters/s3';
export { VercelBlobAdapter } from './lib/adapters/vercel-blob';
export { UploadThingAdapter } from './lib/adapters/uploadthing';

// Types
export type {
  UploadFile,
  UploadConfig,
  UploadAdapter,
  UploadOptions,
  UploadResult,
  FileMetadata,
  FileType,
  UploadStatus,
  DraggerConfig,
  FilePreviewProps,
  ProgressIndicatorProps,
  S3Config,
  CloudinaryConfig,
  VercelBlobConfig,
  UploadThingConfig,
} from './lib/types';

// Utilities
export {
  formatFileSize,
  getFileType,
  extractFileMetadata,
  getImageDimensions,
  getMediaDuration,
  validateFile,
  generateFileId,
  createPreviewUrl,
  revokePreviewUrl,
  resizeImage,
  generateThumbnail,
} from './lib/utils'; 