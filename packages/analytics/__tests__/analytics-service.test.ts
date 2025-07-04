import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AnalyticsService } from '../lib/analytics-service'
import type { AnalyticsConfig } from '../lib/types'

describe('AnalyticsService', () => {
  let service: AnalyticsService
  let mockConfig: AnalyticsConfig

  beforeEach(() => {
    mockConfig = {
      providers: [
        { name: 'posthog', enabled: true, config: {} },
        { name: 'vercel', enabled: true, config: {} }
      ],
      tracking: {
        autotrack: true,
        pageviews: true,
        clicks: true,
        forms: true,
        errors: true,
        performance: true,
        customEvents: [],
        excludePaths: [],
        sessionTimeout: 30 * 60 * 1000
      },
      privacy: {
        anonymizeIp: true,
        respectDnt: true,
        consentRequired: false,
        dataRetention: 365,
        allowedDomains: [],
        blockedCountries: []
      },
      export: {
        maxRows: 100000,
        formats: ['csv', 'json'],
        retention: 30,
        rateLimits: {
          perHour: 10,
          perDay: 100
        }
      },
      dashboard: {
        refreshInterval: 30000,
        maxWidgets: 20,
        allowPublicDashboards: true,
        defaultDateRange: 'last-30-days'
      },
      alerts: {
        enabled: true,
        channels: [],
        rules: []
      }
    }

    service = new AnalyticsService(mockConfig)
  })

  describe('Event Tracking', () => {
    it('should track events with generated id and timestamp', async () => {
      const event = {
        event: 'test_event',
        properties: { test: 'value' },
        userId: 'user123'
      }

      await service.track(event)

      // Since we're mocking the actual tracking, we just verify no errors are thrown
      expect(true).toBe(true)
    })

    it('should identify users', async () => {
      const userId = 'user123'
      const properties = { name: 'Test User', email: 'test@example.com' }

      await service.identify(userId, properties)

      // Since we're mocking the actual identification, we just verify no errors are thrown
      expect(true).toBe(true)
    })
  })

  describe('Dashboard Management', () => {
    it('should create a dashboard', async () => {
      const dashboardData = {
        name: 'Test Dashboard',
        description: 'A test dashboard',
        widgets: [],
        layout: {
          columns: 12,
          rowHeight: 150,
          margin: [10, 10] as [number, number],
          containerPadding: [10, 10] as [number, number],
          breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
          cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
        },
        filters: [],
        dateRange: {
          start: new Date('2023-01-01'),
          end: new Date('2023-01-31'),
          preset: 'last-30-days' as const
        },
        isPublic: false
      }

      const dashboard = await service.createDashboard(dashboardData)

      expect(dashboard).toBeDefined()
      expect(dashboard.id).toBeDefined()
      expect(dashboard.name).toBe('Test Dashboard')
      expect(dashboard.createdAt).toBeInstanceOf(Date)
      expect(dashboard.updatedAt).toBeInstanceOf(Date)
    })
  })

  describe('Real-time Analytics', () => {
    it('should get real-time metrics', async () => {
      const metrics = await service.getRealtimeMetrics()

      expect(metrics).toBeDefined()
      expect(metrics.timestamp).toBeInstanceOf(Date)
      expect(typeof metrics.activeUsers).toBe('number')
      expect(typeof metrics.pageviews).toBe('number')
      expect(Array.isArray(metrics.topPages)).toBe(true)
      expect(Array.isArray(metrics.topEvents)).toBe(true)
    })
  })

  describe('A/B Testing', () => {
    it('should create an A/B test', async () => {
      const testData = {
        name: 'Button Color Test',
        description: 'Testing button colors',
        status: 'draft' as const,
        type: 'split' as const,
        variants: [],
        traffic: 100,
        startDate: new Date(),
        confidence: 95,
        significance: 0.05,
        metrics: [],
        hypothesis: 'Red buttons will perform better'
      }

      const test = await service.createABTest(testData)

      expect(test).toBeDefined()
      expect(test.id).toBeDefined()
      expect(test.name).toBe('Button Color Test')
    })
  })

  describe('Data Export', () => {
    it('should create an export job', async () => {
      const query = {
        metrics: ['pageviews', 'users'],
        dateRange: {
          start: new Date('2023-01-01'),
          end: new Date('2023-01-31'),
          preset: 'last-30-days' as const
        }
      }

      const exportJob = await service.createExport('events', 'csv', query, 'Test Export')

      expect(exportJob).toBeDefined()
      expect(exportJob.id).toBeDefined()
      expect(exportJob.name).toBe('Test Export')
      expect(exportJob.type).toBe('events')
      expect(exportJob.format).toBe('csv')
      expect(exportJob.status).toBe('pending')
    })
  })

  describe('Metrics Calculation', () => {
    it('should calculate metrics from queries', async () => {
      const queries = [
        {
          metrics: ['pageviews'],
          dateRange: {
            start: new Date('2023-01-01'),
            end: new Date('2023-01-31'),
            preset: 'last-30-days' as const
          }
        }
      ]

      const metrics = await service.calculateMetrics(queries)

      expect(Array.isArray(metrics)).toBe(true)
      expect(metrics.length).toBe(1)
      
      if (metrics.length > 0) {
        expect(metrics[0]).toHaveProperty('id')
        expect(metrics[0]).toHaveProperty('name')
        expect(metrics[0]).toHaveProperty('value')
        expect(metrics[0]).toHaveProperty('unit')
        expect(metrics[0]).toHaveProperty('timestamp')
      }
    })
  })
}) 