import type { ReactNode } from 'react'
import { GoogleAnalytics } from './google'
import { keys } from './keys'
import { PostHogProvider } from './posthog/client'
import { VercelAnalytics } from './vercel'

// Export types
export * from './lib/types'

// Export services
export { AnalyticsService, analytics } from './lib/analytics-service'

// Export components
export { AnalyticsDashboard } from './components/analytics-dashboard'
export { AnalyticsChart } from './components/analytics-chart'
export { MetricCard } from './components/metric-card'
export { RealtimeWidget } from './components/realtime-widget'
export { DateRangePicker } from './components/date-range-picker'

// Export hooks
export { useAnalytics } from './posthog/client'

type AnalyticsProviderProps = {
  readonly children: ReactNode
}

const { NEXT_PUBLIC_GA_MEASUREMENT_ID } = keys()

export const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => (
  <PostHogProvider>
    {children}
    <VercelAnalytics />
    {NEXT_PUBLIC_GA_MEASUREMENT_ID && (
      <GoogleAnalytics gaId={NEXT_PUBLIC_GA_MEASUREMENT_ID} />
    )}
  </PostHogProvider>
)
