import { createHash } from 'crypto'
import readingTime from 'reading-time'
import slug from 'slug'
import type {
  Content,
  ContentMeta,
  ContentFormData,
  ContentWorkflow,
  ContentReview,
  ContentVersion,
  CMSListParams,
  CMSListResponse,
  ContentStatus,
  ContentType,
  SEOAnalysis
} from './types'
import { SEOAnalyzer } from './seo-analyzer'

export class ContentManager {
  private seoAnalyzer: SEOAnalyzer

  constructor() {
    this.seoAnalyzer = new SEOAnalyzer()
  }

  /**
   * Create new content from form data
   */
  async createContent(
    formData: ContentFormData,
    authorId: string,
    enableSEO = true
  ): Promise<Content> {
    const now = new Date()
    const readingStats = readingTime(formData.body)
    const plainText = this.htmlToPlainText(formData.body)

    // Generate optimized slug
    const optimizedSlug = formData.slug || this.generateSlug(formData.title, formData.seoKeywords)

    const content: Content = {
      id: this.generateId(),
      slug: optimizedSlug,
      title: formData.title,
      description: formData.description,
      excerpt: this.generateExcerpt(plainText),
      
      type: formData.type,
      status: formData.status,
      source: 'manual',
      
      publishedAt: formData.status === 'published' ? now : undefined,
      scheduledAt: formData.scheduledAt,
      
      // SEO optimization
      seoTitle: formData.seoTitle || (enableSEO ? 
        this.seoAnalyzer.generateSEOTitle(formData.title, formData.seoKeywords) : 
        formData.title
      ),
      seoDescription: formData.seoDescription || (enableSEO ? 
        this.seoAnalyzer.generateSEODescription(plainText, formData.seoKeywords) : 
        formData.description
      ),
      seoKeywords: formData.seoKeywords || [],
      
      featuredImage: formData.featuredImage,
      
      // Organization - These would typically be fetched from database
      categories: [], // Would be populated from categoryIds
      tags: [], // Would be populated from tagIds  
      authors: [], // Would be populated from authorIds
      
      readingTime: readingStats.minutes,
      wordCount: readingStats.words,
      
      createdAt: now,
      updatedAt: now,
      version: 1,
      
      body: {
        raw: formData.body,
        html: formData.body,
        plainText: plainText,
        structured: null
      }
    }

    // Run SEO analysis if enabled
    if (enableSEO) {
      content.aiAnalysis = {
        ...await this.seoAnalyzer.analyzeContent(content),
        qualityScore: this.calculateQualityScore(content),
        readabilityScore: this.calculateReadabilityScore(content),
        seoScore: this.calculateSEOScore(content),
        sentiment: this.analyzeSentiment(plainText),
        topics: this.extractTopics(plainText),
        keywords: this.extractKeywords(plainText),
        suggestions: [],
        summary: this.generateSummary(plainText),
        generatedAt: now
      }
    }

    return content
  }

  /**
   * Update existing content
   */
  async updateContent(
    contentId: string,
    formData: Partial<ContentFormData>,
    createVersion = true
  ): Promise<Content> {
    // This would typically fetch from database
    const existingContent = await this.getContent(contentId)
    if (!existingContent) {
      throw new Error('Content not found')
    }

    const now = new Date()
    let updatedContent = { ...existingContent }

    // Create version before updating if requested
    if (createVersion) {
      const version: ContentVersion = {
        id: this.generateId(),
        contentId,
        version: existingContent.version,
        title: existingContent.title,
        body: existingContent.body,
        changes: 'Updated content',
        createdBy: 'current-user', // Would be passed as parameter
        createdAt: now
      }
      
      // Store version (this would be saved to database)
      if (!updatedContent.versions) {
        updatedContent.versions = []
      }
      updatedContent.versions.push(version)
    }

    // Update fields
    if (formData.title) updatedContent.title = formData.title
    if (formData.slug) updatedContent.slug = formData.slug
    if (formData.description) updatedContent.description = formData.description
    if (formData.body) {
      const readingStats = readingTime(formData.body)
      const plainText = this.htmlToPlainText(formData.body)
      
      updatedContent.body = {
        raw: formData.body,
        html: formData.body,
        plainText,
        structured: null
      }
      updatedContent.readingTime = readingStats.minutes
      updatedContent.wordCount = readingStats.words
      updatedContent.excerpt = this.generateExcerpt(plainText)
    }
    
    if (formData.status) updatedContent.status = formData.status
    if (formData.scheduledAt) updatedContent.scheduledAt = formData.scheduledAt
    if (formData.seoTitle) updatedContent.seoTitle = formData.seoTitle
    if (formData.seoDescription) updatedContent.seoDescription = formData.seoDescription
    if (formData.seoKeywords) updatedContent.seoKeywords = formData.seoKeywords
    if (formData.featuredImage) updatedContent.featuredImage = formData.featuredImage

    updatedContent.updatedAt = now
    updatedContent.version += 1

    // Re-run SEO analysis if content changed
    if (formData.body || formData.title || formData.seoKeywords) {
      const seoAnalysis = await this.seoAnalyzer.analyzeContent(updatedContent)
      updatedContent.aiAnalysis = {
        ...seoAnalysis,
        qualityScore: this.calculateQualityScore(updatedContent),
        readabilityScore: this.calculateReadabilityScore(updatedContent),
        seoScore: this.calculateSEOScore(updatedContent),
        sentiment: this.analyzeSentiment(updatedContent.body.plainText),
        topics: this.extractTopics(updatedContent.body.plainText),
        keywords: this.extractKeywords(updatedContent.body.plainText),
        suggestions: seoAnalysis.recommendations.map(rec => ({
          type: rec.type as any,
          priority: rec.priority,
          title: rec.title,
          description: rec.description,
          actionable: true
        })),
        summary: this.generateSummary(updatedContent.body.plainText),
        generatedAt: now
      }
    }

    return updatedContent
  }

  /**
   * Get content by ID
   */
  async getContent(id: string): Promise<Content | null> {
    // This would typically fetch from database
    // For now, return null as placeholder
    return null
  }

  /**
   * List content with filtering and pagination
   */
  async listContent(params: CMSListParams = {}): Promise<CMSListResponse<ContentMeta>> {
    // This would typically query database
    // For now, return empty response as placeholder
    return {
      data: [],
      pagination: {
        page: params.page || 1,
        limit: params.limit || 10,
        total: 0,
        totalPages: 0
      },
      filters: params
    }
  }

  /**
   * Duplicate content
   */
  async duplicateContent(contentId: string, title?: string): Promise<Content> {
    const originalContent = await this.getContent(contentId)
    if (!originalContent) {
      throw new Error('Content not found')
    }

    const duplicatedTitle = title || `${originalContent.title} (Copy)`
    const duplicatedSlug = this.generateSlug(duplicatedTitle)

    return {
      ...originalContent,
      id: this.generateId(),
      slug: duplicatedSlug,
      title: duplicatedTitle,
      status: 'draft',
      publishedAt: undefined,
      scheduledAt: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      parentId: originalContent.id,
      versions: undefined
    }
  }

  /**
   * Archive content
   */
  async archiveContent(contentId: string): Promise<Content> {
    const content = await this.getContent(contentId)
    if (!content) {
      throw new Error('Content not found')
    }

    return {
      ...content,
      status: 'archived',
      updatedAt: new Date()
    }
  }

  /**
   * Restore archived content
   */
  async restoreContent(contentId: string): Promise<Content> {
    const content = await this.getContent(contentId)
    if (!content) {
      throw new Error('Content not found')
    }

    return {
      ...content,
      status: 'draft',
      updatedAt: new Date()
    }
  }

  /**
   * Schedule content for publishing
   */
  async scheduleContent(contentId: string, publishAt: Date): Promise<Content> {
    const content = await this.getContent(contentId)
    if (!content) {
      throw new Error('Content not found')
    }

    return {
      ...content,
      status: 'approved',
      scheduledAt: publishAt,
      updatedAt: new Date()
    }
  }

  /**
   * Publish content immediately
   */
  async publishContent(contentId: string): Promise<Content> {
    const content = await this.getContent(contentId)
    if (!content) {
      throw new Error('Content not found')
    }

    const now = new Date()
    return {
      ...content,
      status: 'published',
      publishedAt: now,
      scheduledAt: undefined,
      updatedAt: now
    }
  }

  /**
   * Unpublish content
   */
  async unpublishContent(contentId: string): Promise<Content> {
    const content = await this.getContent(contentId)
    if (!content) {
      throw new Error('Content not found')
    }

    return {
      ...content,
      status: 'draft',
      publishedAt: undefined,
      updatedAt: new Date()
    }
  }

  /**
   * Bulk operations
   */
  async bulkUpdateStatus(contentIds: string[], status: ContentStatus): Promise<Content[]> {
    const results: Content[] = []
    
    for (const id of contentIds) {
      const content = await this.getContent(id)
      if (content) {
        results.push({
          ...content,
          status,
          updatedAt: new Date()
        })
      }
    }
    
    return results
  }

  async bulkDelete(contentIds: string[]): Promise<void> {
    // This would typically delete from database
    // For now, just log the operation
    console.log(`Bulk deleting content: ${contentIds.join(', ')}`)
  }

  // Private utility methods

  private generateId(): string {
    return `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateSlug(title: string, keywords?: string[]): string {
    return this.seoAnalyzer.generateSEOSlug(title, keywords)
  }

  private htmlToPlainText(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  }

  private generateExcerpt(text: string, maxLength = 300): string {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
  }

  private calculateQualityScore(content: Content): number {
    let score = 50

    // Content length
    if (content.wordCount > 300) score += 15
    if (content.wordCount > 800) score += 10
    if (content.wordCount > 1500) score += 5

    // SEO elements
    if (content.seoTitle && content.seoTitle !== content.title) score += 10
    if (content.seoDescription) score += 10
    if (content.seoKeywords && content.seoKeywords.length > 0) score += 10

    // Media
    if (content.featuredImage) score += 10
    if (content.body.html.includes('<img')) score += 5

    // Structure
    if (content.body.html.includes('<h2>') || content.body.html.includes('<h3>')) score += 5
    if (content.body.html.includes('<ul>') || content.body.html.includes('<ol>')) score += 5

    return Math.min(100, score)
  }

  private calculateReadabilityScore(content: Content): number {
    const text = content.body.plainText
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const avgWordsPerSentence = content.wordCount / sentences.length
    
    let score = 100
    
    // Penalize long sentences
    if (avgWordsPerSentence > 20) score -= 20
    if (avgWordsPerSentence > 30) score -= 20
    
    // Penalize very short content
    if (content.wordCount < 100) score -= 30
    
    return Math.max(0, score)
  }

  private calculateSEOScore(content: Content): number {
    let score = 50
    
    // Title optimization
    if (content.seoTitle && content.seoTitle.length >= 30 && content.seoTitle.length <= 60) score += 15
    
    // Description optimization
    if (content.seoDescription && content.seoDescription.length >= 120 && content.seoDescription.length <= 160) score += 15
    
    // Keywords
    if (content.seoKeywords && content.seoKeywords.length > 0) score += 10
    if (content.seoKeywords && content.seoKeywords.length >= 3) score += 10
    
    // Content length
    if (content.wordCount >= 300) score += 10
    if (content.wordCount >= 1000) score += 5
    
    return Math.min(100, score)
  }

  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    // Simple sentiment analysis - would use actual AI in production
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'fantastic', 'wonderful']
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'disappointing', 'poor']
    
    const lowerText = text.toLowerCase()
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length
    
    if (positiveCount > negativeCount) return 'positive'
    if (negativeCount > positiveCount) return 'negative'
    return 'neutral'
  }

  private extractTopics(text: string): string[] {
    // Simple topic extraction - would use actual AI in production
    const words = text.toLowerCase().split(/\W+/)
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'])
    
    const wordCount = new Map<string, number>()
    words.forEach(word => {
      if (word.length > 3 && !commonWords.has(word)) {
        wordCount.set(word, (wordCount.get(word) || 0) + 1)
      }
    })
    
    return Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word)
  }

  private extractKeywords(text: string): string[] {
    // Simple keyword extraction - would use actual AI in production
    return this.extractTopics(text).slice(0, 3)
  }

  private generateSummary(text: string, maxLength = 200): string {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    let summary = sentences[0] || ''
    
    for (let i = 1; i < sentences.length && summary.length < maxLength; i++) {
      const nextSentence = sentences[i].trim()
      if (summary.length + nextSentence.length + 2 <= maxLength) {
        summary += '. ' + nextSentence
      } else {
        break
      }
    }
    
    return summary + (summary.length < text.length ? '...' : '')
  }
} 