export type UploadStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

export type FileType = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';

export interface UploadFile {
  id: string;
  file: File;
  status: UploadStatus;
  progress: number;
  url?: string;
  thumbnailUrl?: string;
  error?: string;
  metadata?: FileMetadata;
}

export interface FileMetadata {
  originalName: string;
  size: number;
  type: string;
  lastModified: number;
  width?: number;
  height?: number;
  duration?: number; // for video/audio
  fileType: FileType;
}

export interface UploadConfig {
  maxFileSize?: number; // in bytes
  maxFiles?: number;
  acceptedFileTypes?: string[];
  autoUpload?: boolean;
  generateThumbnails?: boolean;
  resizeImages?: boolean;
  compressionQuality?: number; // 0-1
  maxWidth?: number;
  maxHeight?: number;
  storageProvider?: 'local' | 's3' | 'cloudinary' | 'vercel-blob';
}

export interface UploadAdapter {
  upload: (file: File, options?: UploadOptions) => Promise<UploadResult>;
  delete: (fileUrl: string) => Promise<void>;
  generateThumbnail?: (file: File) => Promise<string>;
}

export interface UploadOptions {
  folder?: string;
  fileName?: string;
  generateThumbnail?: boolean;
  resize?: {
    width?: number;
    height?: number;
    quality?: number;
  };
}

export interface UploadResult {
  url: string;
  thumbnailUrl?: string;
  metadata: FileMetadata;
}

export interface UploadContextType {
  files: UploadFile[];
  config: UploadConfig;
  isUploading: boolean;
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  uploadFile: (id: string) => Promise<void>;
  uploadAll: () => Promise<void>;
  clearFiles: () => void;
  setConfig: (config: Partial<UploadConfig>) => void;
}

export interface DraggerConfig {
  maxFiles?: number;
  acceptedFileTypes?: string[];
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  onDrop?: (files: File[]) => void;
  onReject?: (files: File[]) => void;
}

export interface FilePreviewProps {
  file: UploadFile;
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
  showProgress?: boolean;
  showThumbnail?: boolean;
  className?: string;
}

export interface ProgressIndicatorProps {
  progress: number;
  status: UploadStatus;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  className?: string;
}

// Storage provider specific types
export interface S3Config {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
  endpoint?: string;
}

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

export interface VercelBlobConfig {
  token: string;
  addRandomSuffix?: boolean;
}

export interface UploadThingConfig {
  apiKey: string;
  endpoint?: string; // Your UploadThing file route endpoint
} 