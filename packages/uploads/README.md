# @repo/uploads

A comprehensive file upload package for React applications with drag & drop, progress tracking, image optimization, and cloud storage integration.

## Features

- 🖱️ **Drag & Drop Interface** - Intuitive file selection with visual feedback
- 📊 **Progress Tracking** - Real-time upload progress with smooth animations
- 🖼️ **Image Optimization** - Automatic resizing, compression, and thumbnail generation
- ☁️ **Cloud Storage** - Support for S3, Cloudinary, and Vercel Blob
- 📝 **File Validation** - Type, size, and quantity validation
- 🎨 **Rich Previews** - Thumbnails and metadata display for all file types
- ⚡ **Performance** - Efficient handling of large files and batches
- 🎯 **TypeScript** - Full type safety and autocompletion
- 🎨 **Customizable** - Fully customizable UI components
- 📱 **Responsive** - Works on all device sizes

## Installation

This package is already installed as part of the monorepo. To use it in your app:

```bash
# The package is available as a workspace dependency
pnpm install
```

## Basic Usage

### Simple Upload Manager with Vercel Blob

```tsx
import { UploadManager, VercelBlobAdapter } from '@repo/uploads';

// Configure Vercel Blob adapter
const vercelBlobAdapter = new VercelBlobAdapter({
  token: process.env.BLOB_READ_WRITE_TOKEN!,
  addRandomSuffix: true,
});

export function MyUploadForm() {
  return (
    <UploadManager
      adapter={vercelBlobAdapter}
      config={{
        maxFileSize: 10 * 1024 * 1024, // 10MB
        maxFiles: 5,
        acceptedFileTypes: ['image/*', 'application/pdf'],
        autoUpload: false,
        generateThumbnails: true,
        resizeImages: true,
        maxWidth: 1920,
        maxHeight: 1080,
      }}
      onUploadComplete={(files) => {
        console.log('Upload complete:', files);
      }}
      onError={(error) => {
        console.error('Upload error:', error);
      }}
    />
  );
}
```

### Upload Manager with UploadThing

```tsx
import { UploadManager, UploadThingAdapter } from '@repo/uploads';

// Configure UploadThing adapter
const uploadThingAdapter = new UploadThingAdapter({
  apiKey: process.env.UPLOADTHING_SECRET!,
  endpoint: '/api/uploadthing',
});

export function MyUploadForm() {
  return (
    <UploadManager
      adapter={uploadThingAdapter}
      config={{
        maxFileSize: 10 * 1024 * 1024, // 10MB
        maxFiles: 5,
        acceptedFileTypes: ['image/*', 'application/pdf'],
        autoUpload: false,
        generateThumbnails: true,
      }}
      onUploadComplete={(files) => {
        console.log('Upload complete:', files);
      }}
      onError={(error) => {
        console.error('Upload error:', error);
      }}
    />
  );
}
```

### Custom Dropzone

```tsx
import { UploadDropzone, useUpload } from '@repo/uploads';

export function CustomUploader() {
  const { files, addFiles, uploadAll } = useUpload({
    config: {
      maxFiles: 3,
      acceptedFileTypes: ['image/*'],
    },
  });

  return (
    <div className="space-y-4">
      <UploadDropzone
        maxFiles={3}
        acceptedFileTypes={['image/*']}
        onDrop={addFiles}
        onReject={(files) => alert(`${files.length} files rejected`)}
      />
      
      {files.length > 0 && (
        <button onClick={uploadAll}>
          Upload {files.length} files
        </button>
      )}
    </div>
  );
}
```

## Configuration

### Upload Config

```tsx
interface UploadConfig {
  maxFileSize?: number;        // Maximum file size in bytes
  maxFiles?: number;           // Maximum number of files
  acceptedFileTypes?: string[]; // Accepted MIME types (supports wildcards)
  autoUpload?: boolean;        // Upload immediately after file selection
  generateThumbnails?: boolean; // Generate thumbnails for images
  resizeImages?: boolean;      // Resize images to max dimensions
  compressionQuality?: number; // Image compression quality (0-1)
  maxWidth?: number;          // Maximum image width
  maxHeight?: number;         // Maximum image height
  storageProvider?: string;   // Storage provider identifier
}
```

### File Type Support

The package supports validation and preview for:

- **Images**: `image/*` (JPEG, PNG, GIF, WebP, etc.)
- **Documents**: PDF, Word, Excel, PowerPoint, text files
- **Media**: Video and audio files with duration detection
- **Archives**: ZIP, RAR, TAR, 7Z files
- **Custom**: Any file type with proper MIME validation

## Storage Adapters

### S3 Adapter

```tsx
import { S3Adapter } from '@repo/uploads';

const s3Adapter = new S3Adapter({
  accessKeyId: 'your-access-key',
  secretAccessKey: 'your-secret-key',
  region: 'us-east-1',
  bucket: 'your-bucket',
  endpoint: 'optional-custom-endpoint', // For S3-compatible services
});
```

### Vercel Blob Adapter

```tsx
import { VercelBlobAdapter } from '@repo/uploads';

const vercelBlobAdapter = new VercelBlobAdapter({
  token: process.env.BLOB_READ_WRITE_TOKEN!, // Get from Vercel dashboard
  addRandomSuffix: true, // Optional: adds random suffix to prevent conflicts
});
```

### UploadThing Adapter

```tsx
import { UploadThingAdapter } from '@repo/uploads';

const uploadThingAdapter = new UploadThingAdapter({
  apiKey: process.env.UPLOADTHING_SECRET!, // Your UploadThing secret key
  endpoint: '/api/uploadthing', // Your UploadThing API route
});
```

### Custom Adapter

Create your own storage adapter by implementing the `UploadAdapter` interface:

```tsx
import type { UploadAdapter, UploadOptions, UploadResult } from '@repo/uploads';

class MyCustomAdapter implements UploadAdapter {
  async upload(file: File, options?: UploadOptions): Promise<UploadResult> {
    // Your upload logic here
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    
    return {
      url: result.url,
      thumbnailUrl: result.thumbnailUrl,
      metadata: {
        originalName: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        fileType: getFileType(file.type),
      },
    };
  }

  async delete(fileUrl: string): Promise<void> {
    await fetch(`/api/upload?url=${encodeURIComponent(fileUrl)}`, {
      method: 'DELETE',
    });
  }
}
```

## Components

### UploadManager

The main component that combines dropzone, file list, and upload controls.

```tsx
<UploadManager
  adapter={adapter}
  config={config}
  onFilesChange={(files) => console.log(files)}
  onUploadComplete={(files) => console.log('Complete:', files)}
  onError={(error) => console.error(error)}
/>
```

### UploadDropzone

A customizable drag & drop area for file selection.

```tsx
<UploadDropzone
  maxFiles={10}
  acceptedFileTypes={['image/*', 'application/pdf']}
  disabled={false}
  onDrop={(files) => handleFiles(files)}
  onReject={(files) => handleRejection(files)}
  loading={isProcessing}
  error={errorMessage}
>
  {/* Custom content */}
  <div>Custom dropzone content</div>
</UploadDropzone>
```

### FilePreview

Individual file preview with progress, actions, and metadata.

```tsx
<FilePreview
  file={uploadFile}
  onRemove={(id) => removeFile(id)}
  onRetry={(id) => retryUpload(id)}
  showProgress={true}
  showThumbnail={true}
/>
```

## Hooks

### useUpload

The main hook for managing upload state and operations.

```tsx
const {
  files,              // Array of upload files
  config,             // Current configuration
  isUploading,        // Global uploading state
  addFiles,           // Add files to upload queue
  removeFile,         // Remove a file by ID
  uploadFile,         // Upload a specific file
  uploadAll,          // Upload all pending files
  retryFile,          // Retry a failed upload
  clearFiles,         // Clear all files
  getFileById,        // Get file by ID
  getFilesByStatus,   // Filter files by status
  // Statistics
  totalFiles,
  successfulUploads,
  failedUploads,
  pendingUploads,
  activeUploads,
} = useUpload({
  adapter,
  config,
  onSuccess: (file) => console.log('Success:', file),
  onError: (file, error) => console.log('Error:', error),
  onProgress: (file, progress) => console.log('Progress:', progress),
});
```

## Utilities

The package includes various utility functions:

```tsx
import {
  formatFileSize,      // Convert bytes to readable format
  getFileType,         // Determine file type from MIME
  extractFileMetadata, // Extract file metadata
  validateFile,        // Validate file against config
  resizeImage,         // Resize image file
  generateThumbnail,   // Generate image thumbnail
} from '@repo/uploads';

// Examples
const size = formatFileSize(1024000); // "1 MB"
const type = getFileType('image/jpeg'); // "image"
const isValid = validateFile(file, { maxFileSize: 1000000 });
```

## Styling

The components use Tailwind CSS classes and can be customized through className props or by overriding the default styles.

### Custom Styling Example

```tsx
<UploadManager
  className="my-custom-uploader"
  config={{
    // ... config
  }}
/>
```

```css
.my-custom-uploader {
  /* Custom styles */
}

.my-custom-uploader .upload-dropzone {
  border: 2px dashed #3b82f6;
  border-radius: 12px;
}
```

## Error Handling

The package provides comprehensive error handling:

```tsx
const { files } = useUpload({
  onError: (file, error) => {
    switch (error) {
      case 'File size exceeds limit':
        toast.error('File too large');
        break;
      case 'File type not supported':
        toast.error('File type not allowed');
        break;
      default:
        toast.error('Upload failed');
    }
  },
});
```

## Examples

### Image Gallery Upload

```tsx
import { UploadManager } from '@repo/uploads';

export function ImageGallery() {
  const [images, setImages] = useState([]);

  return (
    <div>
      <UploadManager
        config={{
          acceptedFileTypes: ['image/*'],
          maxFiles: 20,
          generateThumbnails: true,
          resizeImages: true,
          maxWidth: 1200,
          maxHeight: 1200,
        }}
        onUploadComplete={(files) => {
          setImages(prev => [...prev, ...files]);
        }}
      />
      
      <div className="grid grid-cols-4 gap-4 mt-8">
        {images.map((image) => (
          <img
            key={image.id}
            src={image.thumbnailUrl || image.url}
            alt={image.metadata.originalName}
            className="w-full h-32 object-cover rounded-lg"
          />
        ))}
      </div>
    </div>
  );
}
```

### Document Upload with Validation

```tsx
export function DocumentUploader() {
  return (
    <UploadManager
      config={{
        acceptedFileTypes: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        maxFileSize: 25 * 1024 * 1024, // 25MB
        maxFiles: 5,
      }}
      onError={(error) => {
        if (error.includes('file size')) {
          alert('File must be smaller than 25MB');
        } else if (error.includes('file type')) {
          alert('Only PDF and Word documents are allowed');
        }
      }}
    />
  );
}
```

## Setup Instructions

### Vercel Blob Setup

1. **Get a Vercel Blob token:**
   - Go to your Vercel dashboard
   - Navigate to Storage → Blob
   - Create a new blob store or use existing
   - Copy the `BLOB_READ_WRITE_TOKEN`

2. **Add to environment variables:**
   ```env
   BLOB_READ_WRITE_TOKEN=your_blob_token_here
   ```

3. **Use in your app:**
   ```tsx
   const adapter = new VercelBlobAdapter({
     token: process.env.BLOB_READ_WRITE_TOKEN!,
   });
   ```

### UploadThing Setup

1. **Create UploadThing account:**
   - Go to [uploadthing.com](https://uploadthing.com)
   - Create an account and get your API keys

2. **Add to environment variables:**
   ```env
   UPLOADTHING_SECRET=your_secret_key_here
   ```

3. **Create API route** (`app/api/uploadthing/route.ts`):
   ```tsx
   import { createUploadthing, type FileRouter } from "uploadthing/next";
   
   const f = createUploadthing();
   
   export const ourFileRouter = {
     imageUploader: f({ image: { maxFileSize: "4MB" } })
       .middleware(async ({ req }) => {
         // This code runs on your server before upload
         return { userId: "user123" }; // Add your auth logic here
       })
       .onUploadComplete(async ({ metadata, file }) => {
         console.log("Upload complete for userId:", metadata.userId);
         console.log("file url", file.url);
       }),
   } satisfies FileRouter;
   
   export type OurFileRouter = typeof ourFileRouter;
   ```

4. **Use in your app:**
   ```tsx
   const adapter = new UploadThingAdapter({
     apiKey: process.env.UPLOADTHING_SECRET!,
     endpoint: '/api/uploadthing',
   });
   ```

## Development

To contribute to this package:

1. Make changes to the source files
2. Test with the included examples
3. Update documentation as needed
4. Ensure TypeScript types are correct

## License

MIT License - see the main repository license for details. 