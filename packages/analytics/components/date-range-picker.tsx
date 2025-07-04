'use client'

import React, { useState } from 'react'
import { DateRange, DateRangePreset } from '../lib/types'

interface DateRangePickerProps {
  value: DateRange
  onChange: (dateRange: DateRange) => void
  className?: string
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<DateRangePreset>(
    value.preset || 'custom'
  )

  const presets: { label: string; value: DateRangePreset }[] = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7 days', value: 'last-7-days' },
    { label: 'Last 30 days', value: 'last-30-days' },
    { label: 'Last 90 days', value: 'last-90-days' },
    { label: 'This week', value: 'this-week' },
    { label: 'Last week', value: 'last-week' },
    { label: 'This month', value: 'this-month' },
    { label: 'Last month', value: 'last-month' },
    { label: 'This quarter', value: 'this-quarter' },
    { label: 'Last quarter', value: 'last-quarter' },
    { label: 'This year', value: 'this-year' },
    { label: 'Last year', value: 'last-year' },
    { label: 'Custom', value: 'custom' }
  ]

  const getDateRangeFromPreset = (preset: DateRangePreset): DateRange => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    switch (preset) {
      case 'today':
        return {
          start: today,
          end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1),
          preset
        }
      
      case 'yesterday':
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
        return {
          start: yesterday,
          end: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000 - 1),
          preset
        }
      
      case 'last-7-days':
        return {
          start: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
          end: now,
          preset
        }
      
      case 'last-30-days':
        return {
          start: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
          end: now,
          preset
        }
      
      case 'last-90-days':
        return {
          start: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000),
          end: now,
          preset
        }
      
      case 'this-week':
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())
        return {
          start: startOfWeek,
          end: now,
          preset
        }
      
      case 'last-week':
        const lastWeekStart = new Date(today)
        lastWeekStart.setDate(today.getDate() - today.getDay() - 7)
        const lastWeekEnd = new Date(lastWeekStart)
        lastWeekEnd.setDate(lastWeekStart.getDate() + 6)
        lastWeekEnd.setHours(23, 59, 59, 999)
        return {
          start: lastWeekStart,
          end: lastWeekEnd,
          preset
        }
      
      case 'this-month':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        return {
          start: startOfMonth,
          end: now,
          preset
        }
      
      case 'last-month':
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
        lastMonthEnd.setHours(23, 59, 59, 999)
        return {
          start: lastMonthStart,
          end: lastMonthEnd,
          preset
        }
      
      case 'this-quarter':
        const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3
        const quarterStart = new Date(today.getFullYear(), quarterStartMonth, 1)
        return {
          start: quarterStart,
          end: now,
          preset
        }
      
      case 'last-quarter':
        const lastQuarterStartMonth = Math.floor(today.getMonth() / 3) * 3 - 3
        const lastQuarterStart = new Date(today.getFullYear(), lastQuarterStartMonth, 1)
        const lastQuarterEnd = new Date(today.getFullYear(), lastQuarterStartMonth + 3, 0)
        lastQuarterEnd.setHours(23, 59, 59, 999)
        return {
          start: lastQuarterStart,
          end: lastQuarterEnd,
          preset
        }
      
      case 'this-year':
        const yearStart = new Date(today.getFullYear(), 0, 1)
        return {
          start: yearStart,
          end: now,
          preset
        }
      
      case 'last-year':
        const lastYearStart = new Date(today.getFullYear() - 1, 0, 1)
        const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31)
        lastYearEnd.setHours(23, 59, 59, 999)
        return {
          start: lastYearStart,
          end: lastYearEnd,
          preset
        }
      
      default:
        return value
    }
  }

  const formatDateRange = (dateRange: DateRange) => {
    const preset = presets.find(p => p.value === dateRange.preset)
    if (preset && preset.value !== 'custom') {
      return preset.label
    }
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
      })
    }
    
    return `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`
  }

  const handlePresetSelect = (preset: DateRangePreset) => {
    setSelectedPreset(preset)
    if (preset !== 'custom') {
      const newDateRange = getDateRangeFromPreset(preset)
      onChange(newDateRange)
      setIsOpen(false)
    }
  }

  const handleCustomDateChange = (field: 'start' | 'end', dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return
    
    const newDateRange = {
      ...value,
      [field]: date,
      preset: 'custom' as DateRangePreset
    }
    
    setSelectedPreset('custom')
    onChange(newDateRange)
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {formatDateRange(value)}
        <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Select Date Range</h3>
            
            {/* Preset Options */}
            <div className="grid grid-cols-2 gap-1 mb-4">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handlePresetSelect(preset.value)}
                  className={`px-3 py-2 text-xs rounded-md text-left hover:bg-gray-50 ${
                    selectedPreset === preset.value
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Date Inputs */}
            {selectedPreset === 'custom' && (
              <div className="space-y-3 pt-3 border-t border-gray-200">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={value.start.toISOString().split('T')[0]}
                    onChange={(e) => handleCustomDateChange('start', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={value.end.toISOString().split('T')[0]}
                    onChange={(e) => handleCustomDateChange('end', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
} 