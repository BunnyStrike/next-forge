# @repo/cms

A comprehensive Content Management System with syndication, AI analysis, and SEO optimization capabilities.

## Overview

This package provides a complete CMS solution that includes:

- **Content Management**: Create, edit, publish, and manage content with full versioning
- **RSS Syndication**: Automatically fetch and process content from RSS feeds
- **AI Analysis**: Analyze content quality, readability, and SEO optimization
- **Rich Text Editor**: TipTap-based editor with comprehensive formatting options
- **SEO Optimization**: Built-in SEO analysis and optimization tools
- **Workflow Management**: Approval workflows and content scheduling

## Quick Start

### Basic Usage

```typescript
import { cms, ContentManager, RichTextEditor } from '@repo/cms'

// Use the default CMS instance
const content = await cms.createPost({
  title: 'My First Post',
  body: '<p>Hello world!</p>',
  description: 'A sample blog post',
  authorId: 'user-123'
})

// Or create your own manager
const contentManager = new ContentManager()
const newContent = await contentManager.createContent({
  title: 'Sample Article',
  slug: 'sample-article',
  body: '<p>Article content...</p>',
  type: 'article',
  status: 'draft',
  // ... other fields
}, 'author-id')
```

### Rich Text Editor

```tsx
import { RichTextEditor } from '@repo/cms'

function MyEditor() {
  const [content, setContent] = useState('')

  return (
    <RichTextEditor
      content={content}
      onChange={setContent}
      options={{
        placeholder: 'Start writing...',
        autosave: true,
        enableAI: true,
        enableSEO: true
      }}
    />
  )
}
```

### RSS Syndication

```typescript
import { SyndicationService } from '@repo/cms'

const syndication = new SyndicationService()

// Fetch and process RSS feed
const feedItems = await syndication.fetchFeed('https://example.com/rss')
const processedContent = await syndication.processFeedItems(feedItems, {
  id: 'feed-1',
  name: 'Tech News',
  url: 'https://example.com/rss',
  autoPublish: false,
  enableAIAnalysis: true,
  minimumQualityScore: 70,
  // ... other settings
})
```

### SEO Analysis

```typescript
import { SEOAnalyzer, cms } from '@repo/cms'

const seoAnalyzer = new SEOAnalyzer()

// Analyze existing content
const analysis = await seoAnalyzer.analyzeContent(content)

// Or use the quick method
const quickAnalysis = await cms.analyzeSEO({
  title: 'My Article Title',
  body: '<p>Article content with HTML...</p>',
  description: 'Article description'
})
```

## Features

### Content Management

- **Full CRUD Operations**: Create, read, update, delete content
- **Content Types**: Articles, pages, legal documents, syndicated content
- **Status Management**: Draft, in review, approved, published, archived
- **Versioning**: Track content changes with full version history
- **Scheduling**: Schedule content for future publication
- **Bulk Operations**: Perform operations on multiple items

### Rich Text Editor

- **TipTap Integration**: Modern, extensible rich text editor
- **Real-time Stats**: Word count, character count, reading time
- **Auto-save**: Configurable auto-save functionality
- **Toolbar**: Comprehensive formatting toolbar
- **Image Support**: Direct image insertion and management
- **Link Management**: Easy link insertion and editing

### RSS Syndication

- **RSS Parsing**: Parse RSS/Atom feeds from any source
- **Content Processing**: Clean and normalize syndicated content
- **Deduplication**: Prevent duplicate content using fingerprinting
- **Filtering**: Include/exclude content based on keywords
- **AI Integration**: Analyze syndicated content quality
- **Batch Processing**: Process multiple feeds efficiently

### SEO Optimization

- **Comprehensive Analysis**: Title, meta description, headings, content length
- **Real-time Scoring**: Get SEO scores with actionable recommendations
- **Keyword Analysis**: Analyze keyword usage and density
- **Readability Check**: Assess content readability
- **Image Optimization**: Check alt text and image usage
- **Link Analysis**: Analyze internal and external links

### AI Analysis

- **Quality Scoring**: Rate content quality based on multiple factors
- **Readability Analysis**: Assess how easy content is to read
- **Sentiment Analysis**: Determine content sentiment
- **Topic Extraction**: Automatically identify content topics
- **Keyword Extraction**: Extract relevant keywords
- **Content Summarization**: Generate content summaries

## API Reference

### ContentManager

```typescript
class ContentManager {
  // Create new content
  async createContent(formData: ContentFormData, authorId: string): Promise<Content>
  
  // Update existing content
  async updateContent(contentId: string, formData: Partial<ContentFormData>): Promise<Content>
  
  // Get content by ID
  async getContent(id: string): Promise<Content | null>
  
  // List content with pagination
  async listContent(params: CMSListParams): Promise<CMSListResponse<ContentMeta>>
  
  // Publishing operations
  async publishContent(contentId: string): Promise<Content>
  async scheduleContent(contentId: string, publishAt: Date): Promise<Content>
  async archiveContent(contentId: string): Promise<Content>
  
  // Bulk operations
  async bulkUpdateStatus(contentIds: string[], status: ContentStatus): Promise<Content[]>
  async bulkDelete(contentIds: string[]): Promise<void>
}
```

### SyndicationService

```typescript
class SyndicationService {
  // Fetch RSS feed
  async fetchFeed(feedUrl: string): Promise<FeedItem[]>
  
  // Process feed items
  async processFeedItems(items: FeedItem[], feed: RSSFeed): Promise<Content[]>
  
  // Batch process multiple feeds
  async processFeedsInBatch(feeds: RSSFeed[]): Promise<Map<string, Content[]>>
  
  // Deduplication
  deduplicateContent(newContent: Content[], existing: Set<string>): Content[]
}
```

### SEOAnalyzer

```typescript
class SEOAnalyzer {
  // Analyze content SEO
  async analyzeContent(content: Content): Promise<SEOAnalysis>
  
  // Generate optimized values
  generateSEOSlug(title: string, keywords?: string[]): string
  generateSEOTitle(title: string, keywords?: string[], siteName?: string): string
  generateSEODescription(content: string, keywords?: string[]): string
}
```

## Types

### Core Types

```typescript
interface Content {
  id: string
  slug: string
  title: string
  description: string
  type: ContentType
  status: ContentStatus
  body: ContentBody
  // ... many more fields
}

interface ContentBody {
  raw: string          // Original content
  html: string         // Rendered HTML
  plainText: string    // Plain text for search
  structured?: any     // Structured data
}

interface ContentAIAnalysis {
  qualityScore: number
  readabilityScore: number
  seoScore: number
  sentiment: 'positive' | 'negative' | 'neutral'
  topics: string[]
  keywords: string[]
  suggestions: AISuggestion[]
  summary: string
}
```

### RSS Types

```typescript
interface RSSFeed {
  id: string
  name: string
  url: string
  isActive: boolean
  autoPublish: boolean
  enableAIAnalysis: boolean
  minimumQualityScore?: number
  includeKeywords?: string[]
  excludeKeywords?: string[]
}

interface FeedItem {
  guid: string
  title: string
  description: string
  link: string
  publishedAt: Date
  content?: string
  fingerprint: string
}
```

### SEO Types

```typescript
interface SEOAnalysis {
  score: number
  checks: SEOCheck[]
  recommendations: SEORecommendation[]
  analyzedAt: Date
}

interface SEOCheck {
  name: string
  status: 'pass' | 'fail' | 'warning'
  message: string
  impact: 'low' | 'medium' | 'high'
}
```

## Configuration

### Environment Variables

```bash
# Optional CMS configuration
CUSTOM_CMS_API_KEY=your-api-key
CUSTOM_CMS_API_URL=https://your-cms-api.com
NEXT_PUBLIC_CUSTOM_CMS_URL=https://your-cms.com
```

### Next.js Integration

```typescript
// next.config.js
import { withCMS } from '@repo/cms'

const nextConfig = {
  // your config
}

export default withCMS(nextConfig)
```

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm run test
npm run test:watch
```

### Type Checking

```bash
npm run typecheck
```

## Migration from Legacy API

If you're using the legacy `blog` and `legal` APIs, consider migrating to the new `ContentManager`:

```typescript
// Old way
const posts = await blog.getPosts()

// New way
const contentManager = new ContentManager()
const posts = await contentManager.listContent({ type: 'article' })
```

## Examples

### Complete Content Workflow

```typescript
import { ContentManager, SEOAnalyzer } from '@repo/cms'

async function createOptimizedContent() {
  const contentManager = new ContentManager()
  const seoAnalyzer = new SEOAnalyzer()
  
  // Create content
  const content = await contentManager.createContent({
    title: 'How to Build a CMS',
    slug: 'how-to-build-cms',
    body: '<h1>Building a CMS</h1><p>Content management systems...</p>',
    type: 'article',
    status: 'draft',
    seoKeywords: ['CMS', 'content management', 'web development'],
    // ... other fields
  }, 'author-123')
  
  // Analyze SEO
  const seoAnalysis = await seoAnalyzer.analyzeContent(content)
  console.log(`SEO Score: ${seoAnalysis.score}/100`)
  
  // Publish when ready
  if (seoAnalysis.score > 80) {
    await contentManager.publishContent(content.id)
  }
}
```

### RSS Feed Processing

```typescript
import { SyndicationService } from '@repo/cms'

async function processNewsFeeds() {
  const syndication = new SyndicationService()
  
  const feeds = [
    {
      id: 'tech-news',
      name: 'Tech News',
      url: 'https://technews.com/rss',
      autoPublish: false,
      enableAIAnalysis: true,
      minimumQualityScore: 75,
      includeKeywords: ['technology', 'software', 'development'],
      excludeKeywords: ['politics', 'sports']
    }
  ]
  
  const results = await syndication.processFeedsInBatch(feeds, true)
  
  for (const [feedId, content] of results) {
    console.log(`Processed ${content.length} items from ${feedId}`)
  }
}
```

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure type safety

## License

This package is part of the next-forge template system. 