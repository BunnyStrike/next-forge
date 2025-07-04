'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { 
  AnalyticsDashboard, 
  DashboardWidget, 
  RealtimeMetrics, 
  AnalyticsMetric,
  DateRange,
  DateRangePreset 
} from '../lib/types'
import { AnalyticsChart } from './analytics-chart'
import { MetricCard } from './metric-card'
import { RealtimeWidget } from './realtime-widget'
import { DateRangePicker } from './date-range-picker'

interface AnalyticsDashboardProps {
  dashboard?: AnalyticsDashboard
  showDatePicker?: boolean
  showRefreshButton?: boolean
  refreshInterval?: number
  className?: string
  onDashboardChange?: (dashboard: AnalyticsDashboard) => void
}

export const AnalyticsDashboardComponent: React.FC<AnalyticsDashboardProps> = ({
  dashboard,
  showDatePicker = true,
  showRefreshButton = true,
  refreshInterval = 30000,
  className = '',
  onDashboardChange
}) => {
  const [currentDashboard, setCurrentDashboard] = useState<AnalyticsDashboard | null>(dashboard || null)
  const [dateRange, setDateRange] = useState<DateRange>(
    dashboard?.dateRange || {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date(),
      preset: 'last-30-days'
    }
  )
  const [isLoading, setIsLoading] = useState(false)
  const [realtimeData, setRealtimeData] = useState<RealtimeMetrics | null>(null)
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([])

  // Auto-refresh data
  useEffect(() => {
    if (!refreshInterval) return

    const interval = setInterval(() => {
      refreshData()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [refreshInterval, dateRange])

  // Load initial data
  useEffect(() => {
    refreshData()
  }, [dateRange])

  const refreshData = useCallback(async () => {
    setIsLoading(true)
    try {
      // Load metrics, realtime data, etc.
      await Promise.all([
        loadMetrics(),
        loadRealtimeData(),
        loadWidgetData()
      ])
    } catch (error) {
      console.error('Failed to refresh dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [dateRange])

  const loadMetrics = async () => {
    // Load key metrics for the dashboard
    const mockMetrics: AnalyticsMetric[] = [
      {
        id: '1',
        name: 'Page Views',
        value: 45621,
        unit: 'views',
        timestamp: new Date(),
        period: 'month',
        change: 2341,
        changePercent: 5.4,
        status: 'up',
        category: 'traffic'
      },
      {
        id: '2',
        name: 'Unique Visitors',
        value: 12845,
        unit: 'users',
        timestamp: new Date(),
        period: 'month',
        change: -123,
        changePercent: -0.9,
        status: 'down',
        category: 'traffic'
      },
      {
        id: '3',
        name: 'Conversion Rate',
        value: 3.2,
        unit: '%',
        timestamp: new Date(),
        period: 'month',
        change: 0.1,
        changePercent: 3.2,
        status: 'up',
        category: 'conversion'
      },
      {
        id: '4',
        name: 'Revenue',
        value: 28450,
        unit: 'USD',
        timestamp: new Date(),
        period: 'month',
        change: 3200,
        changePercent: 12.7,
        status: 'up',
        category: 'revenue'
      }
    ]
    setMetrics(mockMetrics)
  }

  const loadRealtimeData = async () => {
    // Load real-time metrics
    const mockRealtime: RealtimeMetrics = {
      activeUsers: 127,
      pageviews: 1543,
      events: 892,
      conversions: 23,
      revenue: 1250,
      topPages: [
        { page: '/home', title: 'Home', views: 234, users: 187, avgTimeOnPage: 145 },
        { page: '/products', title: 'Products', views: 189, users: 156, avgTimeOnPage: 203 },
        { page: '/about', title: 'About', views: 98, users: 87, avgTimeOnPage: 167 }
      ],
      topEvents: [
        { event: 'click_cta', count: 45, users: 34, conversionRate: 12.3 },
        { event: 'form_submit', count: 23, users: 23, conversionRate: 100 },
        { event: 'video_play', count: 67, users: 52, conversionRate: 8.9 }
      ],
      userLocations: [
        { country: 'United States', users: 67, percentage: 52.8 },
        { country: 'Canada', users: 23, percentage: 18.1 },
        { country: 'United Kingdom', users: 18, percentage: 14.2 }
      ],
      deviceBreakdown: [
        { device: 'Desktop', users: 78, percentage: 61.4 },
        { device: 'Mobile', users: 41, percentage: 32.3 },
        { device: 'Tablet', users: 8, percentage: 6.3 }
      ],
      trafficSources: [
        { source: 'Direct', users: 56, percentage: 44.1 },
        { source: 'Google', users: 34, percentage: 26.8 },
        { source: 'Social', users: 23, percentage: 18.1 }
      ],
      timestamp: new Date()
    }
    setRealtimeData(mockRealtime)
  }

  const loadWidgetData = async () => {
    // Load data for each widget in the dashboard
    if (!currentDashboard) return

    // This would load data for each widget based on its configuration
  }

  const handleDateRangeChange = (newDateRange: DateRange) => {
    setDateRange(newDateRange)
    if (currentDashboard && onDashboardChange) {
      const updatedDashboard = {
        ...currentDashboard,
        dateRange: newDateRange
      }
      setCurrentDashboard(updatedDashboard)
      onDashboardChange(updatedDashboard)
    }
  }

  const renderWidget = (widget: DashboardWidget) => {
    switch (widget.type) {
      case 'metric':
        const metric = metrics.find(m => m.name.toLowerCase().includes(widget.title.toLowerCase()))
        return metric ? <MetricCard key={widget.id} metric={metric} /> : null

      case 'chart':
        return (
          <AnalyticsChart
            key={widget.id}
            type={widget.config.chartType || 'line'}
            title={widget.title}
            data={[]} // Would load actual data
            metrics={widget.config.metrics}
            dateRange={dateRange}
          />
        )

      case 'realtime':
        return (
          <RealtimeWidget
            key={widget.id}
            title={widget.title}
            data={realtimeData}
          />
        )

      case 'table':
        return (
          <div key={widget.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">{widget.title}</h3>
            <div className="text-gray-500">Table widget coming soon...</div>
          </div>
        )

      case 'funnel':
        return (
          <div key={widget.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">{widget.title}</h3>
            <div className="text-gray-500">Funnel widget coming soon...</div>
          </div>
        )

      default:
        return (
          <div key={widget.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">{widget.title}</h3>
            <div className="text-gray-500">Widget type not supported: {widget.type}</div>
          </div>
        )
    }
  }

  if (!currentDashboard) {
    return (
      <div className={`analytics-dashboard ${className}`}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Analytics Overview</h1>
          
          {showDatePicker && (
            <div className="flex items-center justify-between mb-6">
              <DateRangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
              />
              
              {showRefreshButton && (
                <button
                  onClick={refreshData}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  {isLoading ? 'Refreshing...' : 'Refresh'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map(metric => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>

        {/* Real-time Data */}
        {realtimeData && (
          <div className="mb-8">
            <RealtimeWidget title="Real-time Activity" data={realtimeData} />
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsChart
            type="line"
            title="Traffic Over Time"
            data={[]} // Would load actual data
            metrics={['pageviews', 'users']}
            dateRange={dateRange}
          />
          
          <AnalyticsChart
            type="bar"
            title="Top Pages"
            data={[]} // Would load actual data
            metrics={['pageviews']}
            dateRange={dateRange}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={`analytics-dashboard ${className}`}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentDashboard.name}</h1>
        {currentDashboard.description && (
          <p className="text-gray-600 mb-4">{currentDashboard.description}</p>
        )}
        
        {showDatePicker && (
          <div className="flex items-center justify-between">
            <DateRangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
            />
            
            {showRefreshButton && (
              <button
                onClick={refreshData}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Dashboard Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentDashboard.widgets.map(renderWidget)}
      </div>
    </div>
  )
}

export { AnalyticsDashboardComponent as AnalyticsDashboard } 