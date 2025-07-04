'use client'

import React from 'react'
import { AnalyticsMetric } from '../lib/types'

interface MetricCardProps {
  metric: AnalyticsMetric
  className?: string
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric, className = '' }) => {
  const formatValue = (value: number, unit: string) => {
    if (unit === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value)
    }
    
    if (unit === '%') {
      return `${value}${unit}`
    }
    
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M ${unit}`
    }
    
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K ${unit}`
    }
    
    return `${value.toLocaleString()} ${unit}`
  }

  const getChangeIcon = () => {
    switch (metric.status) {
      case 'up':
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        )
      case 'down':
        return (
          <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        )
    }
  }

  const getChangeColor = () => {
    switch (metric.status) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className={`bg-white overflow-hidden shadow rounded-lg ${className}`}>
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="text-sm font-medium text-gray-500 truncate">
              {metric.name}
            </div>
          </div>
        </div>
        <div className="mt-1 flex items-baseline">
          <div className="text-2xl font-semibold text-gray-900">
            {formatValue(metric.value, metric.unit)}
          </div>
          {metric.change !== undefined && metric.changePercent !== undefined && (
            <div className={`ml-2 flex items-baseline text-sm font-semibold ${getChangeColor()}`}>
              {getChangeIcon()}
              <span className="ml-1">
                {Math.abs(metric.changePercent).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        {metric.change !== undefined && (
          <div className="mt-1 text-sm text-gray-600">
            {metric.change > 0 ? '+' : ''}{metric.change.toLocaleString()} from last {metric.period}
          </div>
        )}
        {metric.target && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Goal: {formatValue(metric.target, metric.unit)}</span>
              <span>{((metric.value / metric.target) * 100).toFixed(0)}%</span>
            </div>
            <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 