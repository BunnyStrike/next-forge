'use client'

import React from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { ChartType, DateRange } from '../lib/types'

interface AnalyticsChartProps {
  type: ChartType
  title: string
  data: any[]
  metrics: string[]
  dateRange: DateRange
  className?: string
  height?: number
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  type,
  title,
  data,
  metrics,
  dateRange,
  className = '',
  height = 300
}) => {
  // Mock data for demonstration
  const mockData = React.useMemo(() => {
    if (data.length > 0) return data

    // Generate mock data based on date range
    const days = Math.ceil(
      (dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24)
    )
    
    return Array.from({ length: Math.min(days, 30) }, (_, i) => {
      const date = new Date(dateRange.start)
      date.setDate(date.getDate() + i)
      
      return {
        date: date.toISOString().split('T')[0],
        name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        pageviews: Math.floor(Math.random() * 1000) + 500,
        users: Math.floor(Math.random() * 500) + 200,
        sessions: Math.floor(Math.random() * 600) + 300,
        revenue: Math.floor(Math.random() * 5000) + 1000,
        conversions: Math.floor(Math.random() * 50) + 10
      }
    })
  }, [data, dateRange])

  const colors = [
    '#3B82F6', // blue
    '#10B981', // emerald
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // violet
    '#06B6D4', // cyan
    '#84CC16', // lime
    '#F97316'  // orange
  ]

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name"
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            {metrics.map((metric, index) => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        )

      case 'bar':
        return (
          <BarChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name"
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            {metrics.map((metric, index) => (
              <Bar
                key={metric}
                dataKey={metric}
                fill={colors[index % colors.length]}
                radius={[2, 2, 0, 0]}
              />
            ))}
          </BarChart>
        )

      case 'pie':
        const pieData = mockData.slice(-5).map((item, index) => ({
          name: item.name,
          value: item[metrics[0]] || 0,
          fill: colors[index % colors.length]
        }))

        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )

      case 'area':
        return (
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name"
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            {metrics.map((metric, index) => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                fill={colors[index % colors.length]}
                fillOpacity={0.3}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        )

      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            Chart type "{type}" not supported yet
          </div>
        )
    }
  }

  return (
    <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="text-sm text-gray-500">
          {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  )
} 