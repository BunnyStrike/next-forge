import * as cheerio from 'cheerio'
import type { 
  Content, 
  SEOAnalysis, 
  SEOCheck, 
  SEORecommendation 
} from './types'

export class SEOAnalyzer {
  /**
   * Analyze content for SEO optimization
   */
  async analyzeContent(content: Content): Promise<SEOAnalysis> {
    const checks = await this.runSEOChecks(content)
    const recommendations = this.generateRecommendations(content, checks)
    const score = this.calculateSEOScore(checks)

    return {
      score,
      checks,
      recommendations,
      analyzedAt: new Date()
    }
  }

  /**
   * Run comprehensive SEO checks
   */
  private async runSEOChecks(content: Content): Promise<SEOCheck[]> {
    const checks: SEOCheck[] = []
    const $ = cheerio.load(content.body.html)

    // Title checks
    checks.push(...this.checkTitle(content))
    
    // Meta description checks
    checks.push(...this.checkMetaDescription(content))
    
    // Heading structure checks
    checks.push(...this.checkHeadingStructure($))
    
    // Content length checks
    checks.push(...this.checkContentLength(content))
    
    // Image optimization checks
    checks.push(...this.checkImages($))
    
    // Link checks
    checks.push(...this.checkLinks($))
    
    // Keyword density checks
    checks.push(...this.checkKeywordUsage(content))
    
    // Readability checks
    checks.push(...this.checkReadability(content))

    return checks
  }

  /**
   * Check title optimization
   */
  private checkTitle(content: Content): SEOCheck[] {
    const checks: SEOCheck[] = []
    const title = content.seoTitle || content.title
    
    // Title length check
    if (title.length < 30) {
      checks.push({
        name: 'Title Length (Too Short)',
        status: 'warning',
        message: 'Title is shorter than 30 characters. Consider making it more descriptive.',
        impact: 'medium'
      })
    } else if (title.length > 60) {
      checks.push({
        name: 'Title Length (Too Long)',
        status: 'warning',
        message: 'Title is longer than 60 characters. It may be truncated in search results.',
        impact: 'high'
      })
    } else {
      checks.push({
        name: 'Title Length',
        status: 'pass',
        message: 'Title length is optimized for search engines.',
        impact: 'high'
      })
    }

    // Title uniqueness check (simplified)
    if (title.toLowerCase().includes('untitled') || title.toLowerCase().includes('new post')) {
      checks.push({
        name: 'Title Uniqueness',
        status: 'fail',
        message: 'Title appears to be generic. Use a unique, descriptive title.',
        impact: 'high'
      })
    } else {
      checks.push({
        name: 'Title Uniqueness',
        status: 'pass',
        message: 'Title appears to be unique and descriptive.',
        impact: 'high'
      })
    }

    return checks
  }

  /**
   * Check meta description optimization
   */
  private checkMetaDescription(content: Content): SEOCheck[] {
    const checks: SEOCheck[] = []
    const description = content.seoDescription || content.description
    
    if (!description || description.trim().length === 0) {
      checks.push({
        name: 'Meta Description',
        status: 'fail',
        message: 'No meta description found. Add one to improve search engine visibility.',
        impact: 'high'
      })
    } else if (description.length < 120) {
      checks.push({
        name: 'Meta Description Length (Too Short)',
        status: 'warning',
        message: 'Meta description is shorter than 120 characters. Consider expanding it.',
        impact: 'medium'
      })
    } else if (description.length > 160) {
      checks.push({
        name: 'Meta Description Length (Too Long)',
        status: 'warning',
        message: 'Meta description is longer than 160 characters. It may be truncated.',
        impact: 'medium'
      })
    } else {
      checks.push({
        name: 'Meta Description',
        status: 'pass',
        message: 'Meta description length is optimized.',
        impact: 'high'
      })
    }

    return checks
  }

  /**
   * Check heading structure
   */
  private checkHeadingStructure($: cheerio.CheerioAPI): SEOCheck[] {
    const checks: SEOCheck[] = []
    const headings = $('h1, h2, h3, h4, h5, h6')
    
    // H1 check
    const h1Count = $('h1').length
    if (h1Count === 0) {
      checks.push({
        name: 'H1 Heading',
        status: 'warning',
        message: 'No H1 heading found. Consider adding one for better structure.',
        impact: 'medium'
      })
    } else if (h1Count > 1) {
      checks.push({
        name: 'Multiple H1 Headings',
        status: 'warning',
        message: 'Multiple H1 headings found. Use only one H1 per page.',
        impact: 'medium'
      })
    } else {
      checks.push({
        name: 'H1 Heading',
        status: 'pass',
        message: 'Proper H1 heading structure.',
        impact: 'medium'
      })
    }

    // Heading hierarchy check
    if (headings.length > 0) {
      const headingLevels = headings.map((_, el) => {
        const tagName = $(el).prop('tagName')
        return parseInt(tagName?.charAt(1) || '1')
      }).get()

      let properHierarchy = true
      for (let i = 1; i < headingLevels.length; i++) {
        if (headingLevels[i] > headingLevels[i - 1] + 1) {
          properHierarchy = false
          break
        }
      }

      if (properHierarchy) {
        checks.push({
          name: 'Heading Hierarchy',
          status: 'pass',
          message: 'Heading hierarchy follows proper structure.',
          impact: 'low'
        })
      } else {
        checks.push({
          name: 'Heading Hierarchy',
          status: 'warning',
          message: 'Heading hierarchy skips levels. Ensure proper nesting.',
          impact: 'low'
        })
      }
    }

    return checks
  }

  /**
   * Check content length
   */
  private checkContentLength(content: Content): SEOCheck[] {
    const checks: SEOCheck[] = []
    const wordCount = content.wordCount
    
    if (wordCount < 300) {
      checks.push({
        name: 'Content Length',
        status: 'warning',
        message: 'Content is shorter than 300 words. Consider adding more detailed information.',
        impact: 'medium'
      })
    } else if (wordCount > 2000) {
      checks.push({
        name: 'Content Length',
        status: 'pass',
        message: 'Content length is comprehensive and valuable for readers.',
        impact: 'low'
      })
    } else {
      checks.push({
        name: 'Content Length',
        status: 'pass',
        message: 'Content length is appropriate for the topic.',
        impact: 'low'
      })
    }

    return checks
  }

  /**
   * Check image optimization
   */
  private checkImages($: cheerio.CheerioAPI): SEOCheck[] {
    const checks: SEOCheck[] = []
    const images = $('img')
    
    if (images.length === 0) {
      checks.push({
        name: 'Images',
        status: 'warning',
        message: 'No images found. Consider adding relevant images to enhance content.',
        impact: 'low'
      })
    } else {
      let imagesWithoutAlt = 0
      images.each((_, img) => {
        const alt = $(img).attr('alt')
        if (!alt || alt.trim().length === 0) {
          imagesWithoutAlt++
        }
      })

      if (imagesWithoutAlt === 0) {
        checks.push({
          name: 'Image Alt Text',
          status: 'pass',
          message: 'All images have appropriate alt text.',
          impact: 'medium'
        })
      } else {
        checks.push({
          name: 'Image Alt Text',
          status: 'fail',
          message: `${imagesWithoutAlt} image(s) missing alt text. Add descriptive alt text for accessibility.`,
          impact: 'medium'
        })
      }
    }

    return checks
  }

  /**
   * Check internal and external links
   */
  private checkLinks($: cheerio.CheerioAPI): SEOCheck[] {
    const checks: SEOCheck[] = []
    const links = $('a[href]')
    
    if (links.length === 0) {
      checks.push({
        name: 'Links',
        status: 'warning',
        message: 'No links found. Consider adding relevant internal or external links.',
        impact: 'low'
      })
    } else {
      let internalLinks = 0
      let externalLinks = 0
      
      links.each((_, link) => {
        const href = $(link).attr('href')
        if (href) {
          if (href.startsWith('http') || href.startsWith('//')) {
            externalLinks++
          } else {
            internalLinks++
          }
        }
      })

      if (internalLinks > 0) {
        checks.push({
          name: 'Internal Links',
          status: 'pass',
          message: `Found ${internalLinks} internal link(s). Good for site navigation.`,
          impact: 'low'
        })
      } else {
        checks.push({
          name: 'Internal Links',
          status: 'warning',
          message: 'No internal links found. Consider linking to related content.',
          impact: 'low'
        })
      }

      if (externalLinks > 0) {
        checks.push({
          name: 'External Links',
          status: 'pass',
          message: `Found ${externalLinks} external link(s). Good for providing additional resources.`,
          impact: 'low'
        })
      }
    }

    return checks
  }

  /**
   * Check keyword usage and density
   */
  private checkKeywordUsage(content: Content): SEOCheck[] {
    const checks: SEOCheck[] = []
    
    if (content.seoKeywords && content.seoKeywords.length > 0) {
      const keywords = content.seoKeywords
      const contentText = content.body.plainText.toLowerCase()
      const title = content.title.toLowerCase()
      
      let keywordsInTitle = 0
      let keywordsInContent = 0
      
      keywords.forEach(keyword => {
        if (title.includes(keyword.toLowerCase())) {
          keywordsInTitle++
        }
        if (contentText.includes(keyword.toLowerCase())) {
          keywordsInContent++
        }
      })

      if (keywordsInTitle > 0) {
        checks.push({
          name: 'Keywords in Title',
          status: 'pass',
          message: `${keywordsInTitle} keyword(s) found in title.`,
          impact: 'high'
        })
      } else {
        checks.push({
          name: 'Keywords in Title',
          status: 'warning',
          message: 'No focus keywords found in title. Consider including primary keywords.',
          impact: 'high'
        })
      }

      if (keywordsInContent > 0) {
        checks.push({
          name: 'Keywords in Content',
          status: 'pass',
          message: `${keywordsInContent} keyword(s) found in content.`,
          impact: 'medium'
        })
      } else {
        checks.push({
          name: 'Keywords in Content',
          status: 'warning',
          message: 'No focus keywords found in content. Ensure natural keyword usage.',
          impact: 'medium'
        })
      }
    } else {
      checks.push({
        name: 'Focus Keywords',
        status: 'warning',
        message: 'No focus keywords defined. Add target keywords for better optimization.',
        impact: 'medium'
      })
    }

    return checks
  }

  /**
   * Check readability
   */
  private checkReadability(content: Content): SEOCheck[] {
    const checks: SEOCheck[] = []
    const sentences = content.body.plainText.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const avgWordsPerSentence = content.wordCount / sentences.length
    
    if (avgWordsPerSentence > 20) {
      checks.push({
        name: 'Sentence Length',
        status: 'warning',
        message: 'Average sentence length is high. Consider using shorter sentences for better readability.',
        impact: 'medium'
      })
    } else {
      checks.push({
        name: 'Sentence Length',
        status: 'pass',
        message: 'Sentence length is appropriate for readability.',
        impact: 'medium'
      })
    }

    return checks
  }

  /**
   * Generate SEO recommendations based on checks
   */
  private generateRecommendations(content: Content, checks: SEOCheck[]): SEORecommendation[] {
    const recommendations: SEORecommendation[] = []
    
    // Generate recommendations based on failed checks
    checks.forEach(check => {
      if (check.status === 'fail' || check.status === 'warning') {
        const recommendation = this.createRecommendation(check, content)
        if (recommendation) {
          recommendations.push(recommendation)
        }
      }
    })

    return recommendations
  }

  /**
   * Create recommendation from check
   */
  private createRecommendation(check: SEOCheck, content: Content): SEORecommendation | null {
    const priority = check.impact === 'high' ? 'high' : check.impact === 'medium' ? 'medium' : 'low'

    switch (check.name) {
      case 'Title Length (Too Short)':
        return {
          type: 'title',
          priority,
          title: 'Expand Title',
          description: 'Make your title more descriptive and informative',
          currentValue: content.title,
          suggestedValue: `${content.title} - [Add descriptive keywords]`
        }

      case 'Meta Description':
        return {
          type: 'description',
          priority,
          title: 'Add Meta Description',
          description: 'Create a compelling meta description to improve click-through rates',
          currentValue: content.seoDescription || '',
          suggestedValue: content.description ? content.description.substring(0, 160) : 'Create a compelling description...'
        }

      case 'Focus Keywords':
        return {
          type: 'keywords',
          priority,
          title: 'Define Focus Keywords',
          description: 'Add target keywords to optimize content for search engines',
          currentValue: content.seoKeywords?.join(', ') || '',
          suggestedValue: 'Add 2-3 relevant keywords'
        }

      default:
        return null
    }
  }

  /**
   * Calculate overall SEO score
   */
  private calculateSEOScore(checks: SEOCheck[]): number {
    if (checks.length === 0) return 0

    let totalScore = 0
    const weights = { high: 3, medium: 2, low: 1 }

    checks.forEach(check => {
      const weight = weights[check.impact]
      if (check.status === 'pass') {
        totalScore += weight * 100
      } else if (check.status === 'warning') {
        totalScore += weight * 50
      }
      // 'fail' adds 0 points
    })

    const maxPossibleScore = checks.reduce((sum, check) => sum + weights[check.impact] * 100, 0)
    return Math.round((totalScore / maxPossibleScore) * 100)
  }

  /**
   * Generate SEO-optimized slug
   */
  generateSEOSlug(title: string, keywords?: string[]): string {
    let slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()

    // If keywords provided, ensure primary keyword is in slug
    if (keywords && keywords.length > 0) {
      const primaryKeyword = keywords[0].toLowerCase().replace(/\s+/g, '-')
      if (!slug.includes(primaryKeyword)) {
        slug = `${primaryKeyword}-${slug}`
      }
    }

    return slug.substring(0, 60) // Limit slug length
  }

  /**
   * Generate SEO-optimized meta title
   */
  generateSEOTitle(title: string, keywords?: string[], siteName?: string): string {
    let seoTitle = title

    // Add primary keyword if not present
    if (keywords && keywords.length > 0) {
      const primaryKeyword = keywords[0]
      if (!title.toLowerCase().includes(primaryKeyword.toLowerCase())) {
        seoTitle = `${primaryKeyword} - ${title}`
      }
    }

    // Add site name if provided and space allows
    if (siteName && seoTitle.length + siteName.length + 3 <= 60) {
      seoTitle = `${seoTitle} | ${siteName}`
    }

    return seoTitle.substring(0, 60)
  }

  /**
   * Generate SEO-optimized meta description
   */
  generateSEODescription(content: string, keywords?: string[]): string {
    let description = content.substring(0, 160)

    // Ensure it ends at a word boundary
    const lastSpaceIndex = description.lastIndexOf(' ')
    if (lastSpaceIndex > 120) {
      description = description.substring(0, lastSpaceIndex)
    }

    // Try to include primary keyword naturally
    if (keywords && keywords.length > 0) {
      const primaryKeyword = keywords[0]
      if (!description.toLowerCase().includes(primaryKeyword.toLowerCase())) {
        // If we have space, prepend the keyword
        if (description.length + primaryKeyword.length + 10 <= 160) {
          description = `${primaryKeyword}: ${description}`
        }
      }
    }

    return description
  }
} 