'use client'

import React from 'react'
import { RealtimeMetrics } from '../lib/types'

interface RealtimeWidgetProps {
  title: string
  data: RealtimeMetrics | null
  className?: string
}

export const RealtimeWidget: React.FC<RealtimeWidgetProps> = ({
  title,
  data,
  className = ''
}) => {
  if (!data) {
    return (
      <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="text-gray-500">Loading real-time data...</div>
      </div>
    )
  }

  return (
    <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
          Live
        </div>
      </div>

      {/* Key Real-time Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{data.activeUsers}</div>
          <div className="text-sm text-gray-500">Active Users</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{data.pageviews.toLocaleString()}</div>
          <div className="text-sm text-gray-500">Page Views</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{data.events.toLocaleString()}</div>
          <div className="text-sm text-gray-500">Events</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{data.conversions}</div>
          <div className="text-sm text-gray-500">Conversions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            ${data.revenue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Revenue</div>
        </div>
      </div>

      {/* Detailed Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Top Pages */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Top Pages</h4>
          <div className="space-y-2">
            {data.topPages.slice(0, 5).map((page, index) => (
              <div key={page.page} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {page.title}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {page.page}
                  </div>
                </div>
                <div className="text-sm text-gray-900 ml-2">
                  {page.views}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Events */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Top Events</h4>
          <div className="space-y-2">
            {data.topEvents.slice(0, 5).map((event, index) => (
              <div key={event.event} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {event.event.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                  <div className="text-xs text-gray-500">
                    {event.users} users
                  </div>
                </div>
                <div className="text-sm text-gray-900 ml-2">
                  {event.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Locations */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Top Countries</h4>
          <div className="space-y-2">
            {data.userLocations.slice(0, 5).map((location, index) => (
              <div key={location.country} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {location.country}
                  </div>
                  <div className="text-xs text-gray-500">
                    {location.percentage.toFixed(1)}%
                  </div>
                </div>
                <div className="text-sm text-gray-900 ml-2">
                  {location.users}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Devices</h4>
          <div className="space-y-2">
            {data.deviceBreakdown.map((device, index) => (
              <div key={device.device} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {device.device}
                  </div>
                  <div className="text-xs text-gray-500">
                    {device.percentage.toFixed(1)}%
                  </div>
                </div>
                <div className="text-sm text-gray-900 ml-2">
                  {device.users}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Last updated: {data.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
} 