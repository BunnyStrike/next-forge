import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MetricCard } from '../components/metric-card'
import type { AnalyticsMetric } from '../lib/types'

describe('MetricCard', () => {
  const mockMetric: AnalyticsMetric = {
    id: '1',
    name: 'Page Views',
    value: 45621,
    unit: 'views',
    timestamp: new Date('2023-01-01'),
    period: 'month',
    change: 2341,
    changePercent: 5.4,
    status: 'up',
    category: 'traffic'
  }

  it('renders metric information correctly', () => {
    render(<MetricCard metric={mockMetric} />)
    
    expect(screen.getByText('Page Views')).toBeInTheDocument()
    expect(screen.getByText('45.6K views')).toBeInTheDocument()
    expect(screen.getByText('5.4%')).toBeInTheDocument()
    expect(screen.getByText('+2,341 from last month')).toBeInTheDocument()
  })

  it('formats currency values correctly', () => {
    const currencyMetric: AnalyticsMetric = {
      ...mockMetric,
      name: 'Revenue',
      value: 28450,
      unit: 'USD',
      category: 'revenue'
    }

    render(<MetricCard metric={currencyMetric} />)
    
    expect(screen.getByText('$28,450')).toBeInTheDocument()
  })

  it('formats percentage values correctly', () => {
    const percentageMetric: AnalyticsMetric = {
      ...mockMetric,
      name: 'Conversion Rate',
      value: 3.2,
      unit: '%',
      category: 'conversion'
    }

    render(<MetricCard metric={percentageMetric} />)
    
    expect(screen.getByText('3.2%')).toBeInTheDocument()
  })

  it('shows decline status correctly', () => {
    const decliningMetric: AnalyticsMetric = {
      ...mockMetric,
      change: -123,
      changePercent: -2.7,
      status: 'down'
    }

    render(<MetricCard metric={decliningMetric} />)
    
    expect(screen.getByText('2.7%')).toBeInTheDocument()
    expect(screen.getByText('-123 from last month')).toBeInTheDocument()
  })

  it('renders target progress when target is provided', () => {
    const metricWithTarget: AnalyticsMetric = {
      ...mockMetric,
      target: 50000
    }

    render(<MetricCard metric={metricWithTarget} />)
    
    expect(screen.getByText('Goal: 50.0K views')).toBeInTheDocument()
    expect(screen.getByText('91%')).toBeInTheDocument()
  })

  it('handles large numbers correctly', () => {
    const largeMetric: AnalyticsMetric = {
      ...mockMetric,
      value: 1500000
    }

    render(<MetricCard metric={largeMetric} />)
    
    expect(screen.getByText('1.5M views')).toBeInTheDocument()
  })
}) 