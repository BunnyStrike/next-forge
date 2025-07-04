// Enhanced CMS System - Content Management & Syndication

// Core types
export type * from './lib/types'

// Content Management
export { ContentManager } from './lib/content-manager'
export { SyndicationService } from './lib/syndication'
export { SEOAnalyzer } from './lib/seo-analyzer'

// Components  
export { RichTextEditor, useRichTextEditor } from './components/rich-text-editor'
export { Body } from './components/body'
export { CodeBlock } from './components/code-block'
export { Feed } from './components/feed'
export { Image } from './components/image'
export { TableOfContents } from './components/toc'
export { Toolbar } from './components/toolbar'

// Environment keys
export { keys } from './keys'

// Next.js configuration
export { withCMS } from './next-config'

// Legacy API for backward compatibility
interface PostMeta {
  slug: string
  title: string
  description: string
  date: string
  image?: string
  authors: {
    name: string
    avatar?: string
    xUrl?: string
  }[]
  categories: {
    name: string
  }[]
}

interface Post extends PostMeta {
  body: {
    plainText: string
    html: string
    readingTime: number
  }
}

interface LegalPostMeta {
  slug: string
  title: string
  description: string
}

interface LegalPost extends LegalPostMeta {
  body: {
    plainText: string
    html: string
    readingTime: number
  }
}

// Legacy blog API - maintains backward compatibility
export const blog = {
  getPosts: async (): Promise<PostMeta[]> => {
    console.warn('blog.getPosts: Using legacy API. Consider migrating to ContentManager.')
    return []
  },

  getLatestPost: async (): Promise<Post | null> => {
    console.warn('blog.getLatestPost: Using legacy API. Consider migrating to ContentManager.')
    return null
  },

  getPost: async (slug: string): Promise<Post | null> => {
    console.warn(`blog.getPost(${slug}): Using legacy API. Consider migrating to ContentManager.`)
    return null
  },
}

// Legacy legal API - maintains backward compatibility
export const legal = {
  getPosts: async (): Promise<LegalPost[]> => {
    console.warn('legal.getPosts: Using legacy API. Consider migrating to ContentManager.')
    return []
  },

  getLatestPost: async (): Promise<LegalPost | null> => {
    console.warn('legal.getLatestPost: Using legacy API. Consider migrating to ContentManager.')
    return null
  },

  getPost: async (slug: string): Promise<LegalPost | null> => {
    console.warn(`legal.getPost(${slug}): Using legacy API. Consider migrating to ContentManager.`)
    return null
  },
}

// Utility functions for easy access
export class CMS {
  // TODO: Implement these services
  // private contentManager: ContentManager
  // private syndicationService: SyndicationService
  // private seoAnalyzer: SEOAnalyzer

  constructor() {
    console.warn('CMS class is not fully implemented yet')
    // this.contentManager = new ContentManager()
    // this.syndicationService = new SyndicationService()
    // this.seoAnalyzer = new SEOAnalyzer()
  }

  // Content management shortcuts
  get content() {
    throw new Error('ContentManager not implemented yet')
    // return this.contentManager
  }

  get syndication() {
    throw new Error('SyndicationService not implemented yet')
    // return this.syndicationService
  }

  get seo() {
    throw new Error('SEOAnalyzer not implemented yet')
    // return this.seoAnalyzer
  }

  /**
   * Quick content creation
   */
  async createPost(data: {
    title: string
    body: string
    description?: string
    seoKeywords?: string[]
    authorId: string
  }) {
    throw new Error('ContentManager not implemented yet')
    // return this.contentManager.createContent({...}, data.authorId)
  }

  /**
   * Quick SEO analysis
   */
  async analyzeSEO(content: { title: string; body: string; description?: string }) {
    throw new Error('SEOAnalyzer not implemented yet')
    // Basic analysis would go here
  }
}

// Default CMS instance
export const cms = new CMS()
