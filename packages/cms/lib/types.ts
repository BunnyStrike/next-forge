import type { ReactNode } from 'react'

// ===== CORE CONTENT TYPES =====

export type ContentStatus = 
  | 'draft' 
  | 'in_review' 
  | 'approved' 
  | 'published' 
  | 'archived'

export type ContentType = 
  | 'article' 
  | 'page' 
  | 'legal' 
  | 'syndicated' 
  | 'ai_generated'

export type ContentSource = 
  | 'manual' 
  | 'rss_feed' 
  | 'ai_generated' 
  | 'syndicated' 
  | 'imported'

export interface ContentMeta {
  id: string
  slug: string
  title: string
  description: string
  excerpt?: string
  
  // Content metadata
  type: ContentType
  status: ContentStatus
  source: ContentSource
  
  // Publishing
  publishedAt?: Date
  scheduledAt?: Date
  
  // SEO
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  ogImage?: string
  
  // Media
  featuredImage?: string
  gallery?: string[]
  
  // Organization
  categories: ContentCategory[]
  tags: ContentTag[]
  authors: ContentAuthor[]
  
  // Metrics
  readingTime: number
  wordCount: number
  qualityScore?: number
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
  
  // Versioning
  version: number
  parentId?: string
  
  // AI Analysis
  aiAnalysis?: ContentAIAnalysis
  
  // Syndication
  syndicationData?: SyndicationData
}

export interface Content extends ContentMeta {
  body: ContentBody
  versions?: ContentVersion[]
}

export interface ContentBody {
  raw: string          // Original markdown/HTML
  html: string         // Rendered HTML
  plainText: string    // Plain text for search
  structured?: any     // Structured content (for block editors)
}

export interface ContentVersion {
  id: string
  contentId: string
  version: number
  title: string
  body: ContentBody
  changes: string
  createdBy: string
  createdAt: Date
}

export interface ContentCategory {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  parentId?: string
}

export interface ContentTag {
  id: string
  name: string
  slug: string
  color?: string
}

export interface ContentAuthor {
  id: string
  name: string
  email?: string
  avatar?: string
  bio?: string
  social?: {
    twitter?: string
    linkedin?: string
    github?: string
  }
}

// ===== AI ANALYSIS TYPES =====

export interface ContentAIAnalysis {
  qualityScore: number
  readabilityScore: number
  seoScore: number
  sentiment: 'positive' | 'negative' | 'neutral'
  topics: string[]
  keywords: string[]
  suggestions: AISuggestion[]
  summary: string
  generatedAt: Date
}

export interface AISuggestion {
  type: 'seo' | 'readability' | 'content' | 'structure'
  priority: 'low' | 'medium' | 'high'
  title: string
  description: string
  actionable: boolean
}

// ===== SYNDICATION TYPES =====

export interface SyndicationData {
  sourceUrl: string
  sourceName: string
  sourceType: 'rss' | 'api' | 'manual'
  originalPublishedAt?: Date
  lastSyncedAt: Date
  feedId?: string
  fingerprint: string  // For deduplication
}

export interface RSSFeed {
  id: string
  name: string
  url: string
  isActive: boolean
  lastFetchedAt?: Date
  lastFetchError?: string
  
  // Processing settings
  autoPublish: boolean
  requireReview: boolean
  categoryId?: string
  tags: string[]
  
  // AI processing
  enableAIAnalysis: boolean
  minimumQualityScore?: number
  
  // Filtering
  includeKeywords?: string[]
  excludeKeywords?: string[]
  
  createdAt: Date
  updatedAt: Date
}

export interface FeedItem {
  guid: string
  title: string
  description: string
  link: string
  publishedAt: Date
  author?: string
  categories?: string[]
  content?: string
  fingerprint: string
}

// ===== WORKFLOW TYPES =====

export interface ContentWorkflow {
  id: string
  name: string
  steps: WorkflowStep[]
  isDefault: boolean
  contentTypes: ContentType[]
}

export interface WorkflowStep {
  id: string
  name: string
  type: 'review' | 'approve' | 'publish' | 'notify'
  assigneeId?: string
  requiredRole?: string
  autoAdvance: boolean
  order: number
}

export interface ContentReview {
  id: string
  contentId: string
  reviewerId: string
  status: 'pending' | 'approved' | 'rejected'
  comments?: string
  createdAt: Date
  completedAt?: Date
}

// ===== SEO TYPES =====

export interface SEOAnalysis {
  score: number
  checks: SEOCheck[]
  recommendations: SEORecommendation[]
  analyzedAt: Date
}

export interface SEOCheck {
  name: string
  status: 'pass' | 'fail' | 'warning'
  message: string
  impact: 'low' | 'medium' | 'high'
}

export interface SEORecommendation {
  type: 'title' | 'description' | 'keywords' | 'headings' | 'images' | 'links'
  priority: 'low' | 'medium' | 'high'
  title: string
  description: string
  currentValue?: string
  suggestedValue?: string
}

// ===== EDITOR TYPES =====

export interface EditorState {
  content: string
  isLoading: boolean
  hasUnsavedChanges: boolean
  wordCount: number
  characterCount: number
  readingTime: number
}

export interface EditorOptions {
  placeholder?: string
  autosave?: boolean
  autosaveInterval?: number
  spellcheck?: boolean
  enableAI?: boolean
  enableSEO?: boolean
}

// ===== CMS API TYPES =====

export interface CMSListParams {
  page?: number
  limit?: number
  status?: ContentStatus
  type?: ContentType
  categoryId?: string
  authorId?: string
  search?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title'
  sortOrder?: 'asc' | 'desc'
  includeVersions?: boolean
}

export interface CMSListResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters: CMSListParams
}

export interface CMSError {
  code: string
  message: string
  details?: Record<string, any>
}

// ===== COMPONENT TYPES =====

export interface CMSProviderProps {
  children: ReactNode
  apiEndpoint?: string
  enableAI?: boolean
  enableSEO?: boolean
}

export interface ContentFormData {
  title: string
  slug: string
  description: string
  body: string
  type: ContentType
  status: ContentStatus
  categoryIds: string[]
  tagIds: string[]
  authorIds: string[]
  featuredImage?: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  scheduledAt?: Date
}

export interface ContentFormProps {
  content?: Content
  onSave: (data: ContentFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  mode: 'create' | 'edit'
}

// ===== SETTINGS TYPES =====

export interface CMSSettings {
  general: {
    siteName: string
    siteUrl: string
    defaultAuthor: string
    enableComments: boolean
    enableRatings: boolean
  }
  
  ai: {
    enabled: boolean
    provider: 'openai' | 'anthropic' | 'custom'
    autoAnalyze: boolean
    minimumQualityScore: number
  }
  
  seo: {
    enabled: boolean
    autoGenerateMeta: boolean
    defaultMetaImage: string
    googleAnalyticsId?: string
    googleSearchConsoleId?: string
  }
  
  syndication: {
    enabled: boolean
    autoPublish: boolean
    requireReview: boolean
    maxItemsPerFeed: number
    fetchInterval: number // in minutes
  }
  
  publishing: {
    defaultStatus: ContentStatus
    enableScheduling: boolean
    enableVersioning: boolean
    maxVersions: number
  }
}

// ===== ANALYTICS TYPES =====

export interface ContentAnalytics {
  contentId: string
  views: number
  uniqueViews: number
  averageTimeOnPage: number
  bounceRate: number
  socialShares: number
  comments: number
  ratings: {
    average: number
    count: number
  }
  topReferrers: string[]
  topCountries: string[]
  lastUpdated: Date
}

export interface ContentPerformance {
  period: 'day' | 'week' | 'month' | 'year'
  metrics: {
    totalViews: number
    totalContent: number
    topPerforming: Content[]
    trending: Content[]
    engagement: {
      comments: number
      shares: number
      likes: number
    }
  }
} 