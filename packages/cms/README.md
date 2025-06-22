# @repo/cms

A placeholder CMS package for implementing your own content management system.

## Overview

This package previously used BaseHub but has been migrated to support custom CMS implementations. It provides a standardized interface for content management that you can implement with your preferred CMS solution.

## Getting Started

### 1. Choose Your CMS

You can implement any CMS solution that fits your needs:

- **Headless CMS**: Strapi, Sanity, Contentful, Hygraph, etc.
- **File-based**: MDX, Markdown with frontmatter
- **Database-driven**: Custom solution with your database
- **Git-based**: Content stored in your repository

### 2. Implement the Interface

The package exports standardized interfaces for blog posts and legal pages:

```typescript
// Blog content
export interface PostMeta {
  slug: string
  title: string
  description: string
  date: string
  image?: string
  authors: Array<{
    name: string
    avatar?: string
    xUrl?: string
  }>
  categories: Array<{
    name: string
  }>
}

export interface Post extends PostMeta {
  body: {
    plainText: string
    html: string
    readingTime: number
  }
}

// Legal content
export interface LegalPost {
  slug: string
  title: string
  description: string
  body: {
    plainText: string
    html: string
    readingTime: number
  }
}
```

### 3. Implement the API

Replace the placeholder functions in `index.ts`:

```typescript
export const blog = {
  getPosts: async (): Promise<PostMeta[]> => {
    // Implement your blog posts fetching logic
    return []
  },

  getLatestPost: async (): Promise<Post | null> => {
    // Implement your latest post fetching logic
    return null
  },

  getPost: async (slug: string): Promise<Post | null> => {
    // Implement your single post fetching logic
    return null
  },
}

export const legal = {
  getPosts: async (): Promise<LegalPost[]> => {
    // Implement your legal pages fetching logic
    return []
  },

  getLatestPost: async (): Promise<LegalPost | null> => {
    // Implement your latest legal post fetching logic
    return null
  },

  getPost: async (slug: string): Promise<LegalPost | null> => {
    // Implement your single legal post fetching logic
    return null
  },
}
```

### 4. Update Components

The components in `components/` are placeholders. Customize them for your CMS:

- `Body` - Rich text content renderer
- `CodeBlock` - Code syntax highlighting
- `Feed` - Content feed/listing
- `Image` - Optimized image component
- `TableOfContents` - Navigation for long content
- `Toolbar` - CMS editing toolbar (if needed)

### 5. Configure Environment Variables

Update `keys.ts` with your CMS-specific environment variables:

```typescript
export const keys = () =>
  createEnv({
    server: {
      CUSTOM_CMS_API_KEY: z.string().optional(),
      CUSTOM_CMS_API_URL: z.string().url().optional(),
    },
    client: {
      NEXT_PUBLIC_CUSTOM_CMS_URL: z.string().url().optional(),
    },
    runtimeEnv: {
      CUSTOM_CMS_API_KEY: process.env.CUSTOM_CMS_API_KEY,
      CUSTOM_CMS_API_URL: process.env.CUSTOM_CMS_API_URL,
      NEXT_PUBLIC_CUSTOM_CMS_URL: process.env.NEXT_PUBLIC_CUSTOM_CMS_URL,
    },
  })
```

### 6. Update Next.js Configuration

If your CMS serves images, add the hostname to `next-config.ts`:

```typescript
export const withCMS = (config: NextConfig) => ({
  ...config,
  images: {
    ...config.images,
    remotePatterns: [
      ...config.images.remotePatterns,
      {
        protocol: 'https',
        hostname: 'your-cms-domain.com',
      },
    ],
  },
})
```

## Example Implementations

### MDX with File System

```typescript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export const blog = {
  getPosts: async (): Promise<PostMeta[]> => {
    const postsDirectory = path.join(process.cwd(), 'content/blog')
    const filenames = fs.readdirSync(postsDirectory)
    
    return filenames.map(filename => {
      const filePath = path.join(postsDirectory, filename)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(fileContents)
      
      return {
        slug: filename.replace('.mdx', ''),
        title: data.title,
        description: data.description,
        date: data.date,
        image: data.image,
        authors: data.authors || [],
        categories: data.categories || [],
      }
    })
  },
  
  // ... implement other methods
}
```

### Strapi CMS

```typescript
export const blog = {
  getPosts: async (): Promise<PostMeta[]> => {
    const response = await fetch(`${process.env.STRAPI_URL}/api/posts?populate=*`)
    const { data } = await response.json()
    
    return data.map(post => ({
      slug: post.attributes.slug,
      title: post.attributes.title,
      description: post.attributes.description,
      date: post.attributes.publishedAt,
      image: post.attributes.image?.data?.attributes?.url,
      authors: post.attributes.authors?.data || [],
      categories: post.attributes.categories?.data || [],
    }))
  },
  
  // ... implement other methods
}
```

## Migration from BaseHub

This package was migrated from BaseHub. The API interface has been preserved to minimize breaking changes in consuming applications. Simply implement the functions with your new CMS and update any component usage as needed. 