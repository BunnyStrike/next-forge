import Parser from 'rss-parser'
import { createHash } from 'crypto'
import { format } from 'date-fns'
import * as cheerio from 'cheerio'
import TurndownService from 'turndown'
import sanitizeHtml from 'sanitize-html'
import readingTime from 'reading-time'
import slug from 'slug'
import type { 
  RSSFeed, 
  FeedItem, 
  Content, 
  ContentMeta,
  SyndicationData,
  ContentAIAnalysis 
} from './types'

export class SyndicationService {
  private parser: Parser
  private turndownService: TurndownService

  constructor() {
    this.parser = new Parser({
      customFields: {
        feed: ['language', 'copyright'],
        item: ['content:encoded', 'media:content', 'enclosure']
      }
    })

    this.turndownService = new TurndownService({
      headingStyle: 'atx',
      bulletListMarker: '-',
      codeBlockStyle: 'fenced'
    })
  }

  /**
   * Fetch and parse RSS feed
   */
  async fetchFeed(feedUrl: string): Promise<FeedItem[]> {
    try {
      const feed = await this.parser.parseURL(feedUrl)
      
      return feed.items.map((item: any) => ({
        guid: item.guid || item.link || '',
        title: item.title || 'Untitled',
        description: item.contentSnippet || item.summary || '',
        link: item.link || '',
        publishedAt: new Date(item.pubDate || item.isoDate || Date.now()),
        author: item.creator || item['dc:creator'] || undefined,
        categories: item.categories || [],
        content: item['content:encoded'] || item.content || item.contentSnippet,
        fingerprint: this.generateFingerprint(item)
      }))
    } catch (error) {
      console.error(`Failed to fetch RSS feed ${feedUrl}:`, error)
      throw new Error(`RSS feed fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Process feed items into content
   */
  async processFeedItems(
    feedItems: FeedItem[], 
    feed: RSSFeed,
    aiAnalysisEnabled = false
  ): Promise<Content[]> {
    const processedContent: Content[] = []

    for (const item of feedItems) {
      try {
        // Skip if item doesn't meet criteria
        if (!this.shouldProcessItem(item, feed)) {
          continue
        }

        const content = await this.convertItemToContent(item, feed)
        
        // Run AI analysis if enabled
        if (aiAnalysisEnabled && feed.enableAIAnalysis) {
          content.aiAnalysis = await this.analyzeContentWithAI(content)
          
          // Skip if quality score is below threshold
          if (feed.minimumQualityScore && 
              content.aiAnalysis.qualityScore < feed.minimumQualityScore) {
            continue
          }
        }

        processedContent.push(content)
      } catch (error) {
        console.error(`Failed to process feed item ${item.guid}:`, error)
        // Continue processing other items
      }
    }

    return processedContent
  }

  /**
   * Convert feed item to content object
   */
  private async convertItemToContent(item: FeedItem, feed: RSSFeed): Promise<Content> {
    const cleanedContent = this.cleanContent(item.content || item.description)
    const plainText = this.htmlToPlainText(cleanedContent)
    const markdown = this.htmlToMarkdown(cleanedContent)
    const readingStats = readingTime(plainText)

    const syndicationData: SyndicationData = {
      sourceUrl: item.link,
      sourceName: feed.name,
      sourceType: 'rss',
      originalPublishedAt: item.publishedAt,
      lastSyncedAt: new Date(),
      feedId: feed.id,
      fingerprint: item.fingerprint
    }

    const contentSlug = slug(item.title)
    const now = new Date()

    return {
      id: this.generateContentId(item.fingerprint),
      slug: contentSlug,
      title: item.title,
      description: this.truncateText(plainText, 160),
      excerpt: this.truncateText(plainText, 300),
      
      type: 'syndicated',
      status: feed.autoPublish ? 'published' : 'draft',
      source: 'rss_feed',
      
      publishedAt: feed.autoPublish ? item.publishedAt : undefined,
      
      // Basic SEO
      seoTitle: item.title,
      seoDescription: this.truncateText(plainText, 160),
      
      // Organization
      categories: feed.categoryId ? [{ 
        id: feed.categoryId, 
        name: 'Syndicated', 
        slug: 'syndicated' 
      }] : [],
      tags: feed.tags.map(tag => ({ 
        id: this.generateId(tag), 
        name: tag, 
        slug: slug(tag) 
      })),
      authors: item.author ? [{
        id: this.generateId(item.author),
        name: item.author
      }] : [],
      
      readingTime: readingStats.minutes,
      wordCount: readingStats.words,
      
      createdAt: now,
      updatedAt: now,
      version: 1,
      
      syndicationData,
      
      body: {
        raw: markdown,
        html: cleanedContent,
        plainText: plainText,
        structured: null
      }
    }
  }

  /**
   * Check if item should be processed based on feed settings
   */
  private shouldProcessItem(item: FeedItem, feed: RSSFeed): boolean {
    const content = (item.content || item.description).toLowerCase()
    
    // Check include keywords
    if (feed.includeKeywords && feed.includeKeywords.length > 0) {
      const hasIncludeKeyword = feed.includeKeywords.some(keyword => 
        content.includes(keyword.toLowerCase())
      )
      if (!hasIncludeKeyword) return false
    }
    
    // Check exclude keywords
    if (feed.excludeKeywords && feed.excludeKeywords.length > 0) {
      const hasExcludeKeyword = feed.excludeKeywords.some(keyword => 
        content.includes(keyword.toLowerCase())
      )
      if (hasExcludeKeyword) return false
    }
    
    return true
  }

  /**
   * Clean and sanitize HTML content
   */
  private cleanContent(html: string): string {
    return sanitizeHtml(html, {
      allowedTags: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'div', 'span',
        'strong', 'b', 'em', 'i', 'u',
        'ul', 'ol', 'li',
        'a', 'img',
        'blockquote', 'code', 'pre',
        'table', 'thead', 'tbody', 'tr', 'th', 'td'
      ],
      allowedAttributes: {
        'a': ['href', 'title'],
        'img': ['src', 'alt', 'title', 'width', 'height'],
        '*': ['class']
      },
      allowedSchemes: ['http', 'https', 'mailto'],
      allowedSchemesAppliedToAttributes: ['href', 'src']
    })
  }

  /**
   * Convert HTML to plain text
   */
  private htmlToPlainText(html: string): string {
    const $ = cheerio.load(html)
    return $.text().replace(/\s+/g, ' ').trim()
  }

  /**
   * Convert HTML to Markdown
   */
  private htmlToMarkdown(html: string): string {
    return this.turndownService.turndown(html)
  }

  /**
   * Generate unique fingerprint for content deduplication
   */
  private generateFingerprint(item: any): string {
    const content = `${item.title}${item.link}${item.pubDate}`
    return createHash('md5').update(content).digest('hex')
  }

  /**
   * Generate content ID from fingerprint
   */
  private generateContentId(fingerprint: string): string {
    return `syndicated_${fingerprint.substring(0, 12)}`
  }

  /**
   * Generate ID from string
   */
  private generateId(str: string): string {
    return createHash('md5').update(str).digest('hex').substring(0, 8)
  }

  /**
   * Truncate text to specified length
   */
  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
  }

  /**
   * Mock AI analysis - replace with actual AI service
   */
  private async analyzeContentWithAI(content: Content): Promise<ContentAIAnalysis> {
    // This is a mock implementation
    // Replace with actual AI service integration
    
    const wordCount = content.wordCount
    const hasImages = content.body.html.includes('<img')
    const hasLinks = content.body.html.includes('<a href')
    const titleLength = content.title.length
    
    // Simple scoring algorithm (replace with actual AI)
    let qualityScore = 50
    
    if (wordCount > 300) qualityScore += 20
    if (wordCount > 800) qualityScore += 10
    if (hasImages) qualityScore += 15
    if (hasLinks) qualityScore += 10
    if (titleLength > 10 && titleLength < 60) qualityScore += 15
    
    qualityScore = Math.min(100, qualityScore)

    return {
      qualityScore,
      readabilityScore: Math.random() * 40 + 60, // Mock score
      seoScore: Math.random() * 50 + 50, // Mock score
      sentiment: Math.random() > 0.5 ? 'positive' : 'neutral',
      topics: ['technology', 'innovation'], // Mock topics
      keywords: content.title.toLowerCase().split(' ').slice(0, 5),
      suggestions: [
        {
          type: 'seo',
          priority: 'medium',
          title: 'Add meta description',
          description: 'Consider adding a more detailed meta description for better SEO',
          actionable: true
        }
      ],
      summary: this.truncateText(content.body.plainText, 200),
      generatedAt: new Date()
    }
  }

  /**
   * Deduplicate content based on fingerprints
   */
  deduplicateContent(
    newContent: Content[], 
    existingFingerprints: Set<string>
  ): Content[] {
    return newContent.filter(content => 
      !existingFingerprints.has(content.syndicationData?.fingerprint || '')
    )
  }

  /**
   * Batch process multiple feeds
   */
  async processFeedsInBatch(
    feeds: RSSFeed[],
    aiAnalysisEnabled = false,
    maxConcurrent = 3
  ): Promise<Map<string, Content[]>> {
    const results = new Map<string, Content[]>()
    
    // Process feeds in batches to avoid overwhelming the system
    for (let i = 0; i < feeds.length; i += maxConcurrent) {
      const batch = feeds.slice(i, i + maxConcurrent)
      
      const batchPromises = batch.map(async (feed) => {
        try {
          const feedItems = await this.fetchFeed(feed.url)
          const content = await this.processFeedItems(feedItems, feed, aiAnalysisEnabled)
          return { feedId: feed.id, content }
        } catch (error) {
          console.error(`Failed to process feed ${feed.id}:`, error)
          return { feedId: feed.id, content: [] }
        }
      })
      
      const batchResults = await Promise.all(batchPromises)
      batchResults.forEach(({ feedId, content }) => {
        results.set(feedId, content)
      })
    }
    
    return results
  }
} 