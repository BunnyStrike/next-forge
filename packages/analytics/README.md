# Analytics Package

A comprehensive analytics package for Next.js applications with support for multiple providers, real-time dashboards, A/B testing, and advanced data visualization.

## Features

- 📊 **Real-time Analytics Dashboard** - Live metrics and data visualization
- 📈 **Content Performance Tracking** - Track content engagement and performance
- 👥 **User Engagement Metrics** - Monitor user behavior and interactions
- 💰 **Revenue and Subscription Analytics** - Track financial metrics and conversions
- 🔍 **SEO Performance Monitoring** - Monitor organic traffic and keyword performance
- 🧪 **A/B Testing Framework** - Create and manage A/B tests
- 📱 **Custom Event Tracking** - Track custom events and user actions
- 📤 **Data Export Capabilities** - Export analytics data in multiple formats
- 🎯 **Conversion Tracking** - Monitor goal completions and funnel performance
- 🧠 **User Behavior Analytics** - Analyze user journeys and segmentation

## Installation

```bash
npm install @repo/analytics
```

## Quick Start

### 1. Setup Analytics Provider

```tsx
import { AnalyticsProvider } from '@repo/analytics'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  )
}
```

### 2. Environment Variables

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. Track Events

```tsx
import { useAnalytics } from '@repo/analytics'

function MyComponent() {
  const analytics = useAnalytics()

  const handleClick = () => {
    analytics.capture('button_clicked', {
      button_name: 'cta_button',
      page: 'homepage'
    })
  }

  return <button onClick={handleClick}>Click me</button>
}
```

## Components

### AnalyticsDashboard

A comprehensive dashboard component for displaying analytics data.

```tsx
import { AnalyticsDashboard } from '@repo/analytics'

function DashboardPage() {
  return (
    <AnalyticsDashboard
      showDatePicker={true}
      showRefreshButton={true}
      refreshInterval={30000}
    />
  )
}
```

### MetricCard

Display individual metrics with trend indicators.

```tsx
import { MetricCard } from '@repo/analytics'

const metric = {
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
}

function MetricDisplay() {
  return <MetricCard metric={metric} />
}
```

### AnalyticsChart

Visualize data with various chart types.

```tsx
import { AnalyticsChart } from '@repo/analytics'

function ChartDisplay() {
  return (
    <AnalyticsChart
      type="line"
      title="Traffic Over Time"
      data={chartData}
      metrics={['pageviews', 'users']}
      dateRange={{
        start: new Date('2023-01-01'),
        end: new Date('2023-01-31'),
        preset: 'last-30-days'
      }}
    />
  )
}
```

### RealtimeWidget

Display real-time analytics data.

```tsx
import { RealtimeWidget } from '@repo/analytics'

function RealtimeDisplay() {
  return (
    <RealtimeWidget
      title="Real-time Activity"
      data={realtimeData}
    />
  )
}
```

### DateRangePicker

Date range selector for analytics filtering.

```tsx
import { DateRangePicker } from '@repo/analytics'

function FilterControls() {
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date(),
    preset: 'last-30-days'
  })

  return (
    <DateRangePicker
      value={dateRange}
      onChange={setDateRange}
    />
  )
}
```

## Analytics Service

The `AnalyticsService` class provides programmatic access to analytics functionality.

```tsx
import { analytics } from '@repo/analytics'

// Track events
await analytics.track({
  event: 'purchase',
  properties: {
    product_id: '123',
    price: 29.99,
    currency: 'USD'
  },
  userId: 'user_123'
})

// Identify users
await analytics.identify('user_123', {
  name: 'John Doe',
  email: 'john@example.com',
  plan: 'premium'
})

// Query analytics data
const response = await analytics.query({
  metrics: ['pageviews', 'users'],
  dateRange: {
    start: new Date('2023-01-01'),
    end: new Date('2023-01-31'),
    preset: 'last-30-days'
  },
  filters: [
    {
      field: 'page',
      operator: 'contains',
      value: '/products',
      type: 'string'
    }
  ]
})

// Get real-time metrics
const realtimeMetrics = await analytics.getRealtimeMetrics()

// Create dashboard
const dashboard = await analytics.createDashboard({
  name: 'Marketing Dashboard',
  description: 'Key marketing metrics',
  widgets: [],
  layout: defaultLayout,
  filters: [],
  dateRange: defaultDateRange,
  isPublic: false
})

// Create A/B test
const test = await analytics.createABTest({
  name: 'Button Color Test',
  description: 'Testing different button colors',
  status: 'draft',
  type: 'split',
  variants: [
    {
      id: 'control',
      name: 'Blue Button',
      traffic: 50,
      isControl: true,
      config: { buttonColor: 'blue' }
    },
    {
      id: 'variant',
      name: 'Red Button',
      traffic: 50,
      isControl: false,
      config: { buttonColor: 'red' }
    }
  ],
  traffic: 100,
  startDate: new Date(),
  confidence: 95,
  significance: 0.05,
  metrics: [
    {
      id: 'conversion_rate',
      name: 'Conversion Rate',
      type: 'primary',
      goal: 'increase'
    }
  ],
  hypothesis: 'Red buttons will have higher conversion rates'
})

// Export data
const exportJob = await analytics.createExport(
  'events',
  'csv',
  {
    metrics: ['pageviews', 'users'],
    dateRange: {
      start: new Date('2023-01-01'),
      end: new Date('2023-01-31'),
      preset: 'last-30-days'
    }
  },
  'Monthly Events Export'
)
```

## TypeScript Support

The package includes comprehensive TypeScript definitions for all analytics types:

```typescript
import type {
  AnalyticsEvent,
  AnalyticsMetric,
  AnalyticsDashboard,
  UserAnalytics,
  ContentAnalytics,
  ABTest,
  RealtimeMetrics,
  AnalyticsQuery,
  AnalyticsResponse
} from '@repo/analytics'
```

## Configuration

### Analytics Configuration

```typescript
import { AnalyticsService } from '@repo/analytics'

const config = {
  providers: [
    { name: 'posthog', enabled: true, config: {} },
    { name: 'vercel', enabled: true, config: {} },
    { name: 'google', enabled: false, config: {} }
  ],
  tracking: {
    autotrack: true,
    pageviews: true,
    clicks: true,
    forms: true,
    errors: true,
    performance: true,
    customEvents: ['signup', 'purchase'],
    excludePaths: ['/admin', '/api'],
    sessionTimeout: 30 * 60 * 1000 // 30 minutes
  },
  privacy: {
    anonymizeIp: true,
    respectDnt: true,
    consentRequired: false,
    dataRetention: 365, // days
    allowedDomains: ['yourdomain.com'],
    blockedCountries: []
  },
  export: {
    maxRows: 100000,
    formats: ['csv', 'json', 'xlsx'],
    retention: 30, // days
    rateLimits: {
      perHour: 10,
      perDay: 100
    }
  },
  dashboard: {
    refreshInterval: 30000, // 30 seconds
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

const analytics = new AnalyticsService(config)
```

## Supported Providers

- **PostHog** - Product analytics and feature flags
- **Vercel Analytics** - Web analytics for Vercel deployments
- **Google Analytics** - Traditional web analytics
- **Custom** - Extensible for any analytics provider

## Chart Types

- Line charts
- Bar charts
- Pie charts
- Area charts
- Funnel charts (coming soon)
- Heatmaps (coming soon)

## Export Formats

- CSV
- JSON
- XLSX
- PDF (coming soon)

## Testing

The package includes comprehensive test coverage:

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test -- --watch
```

## Examples

### Basic Setup

```tsx
// app/layout.tsx
import { AnalyticsProvider } from '@repo/analytics'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  )
}
```

### Custom Dashboard

```tsx
// app/dashboard/page.tsx
import { AnalyticsDashboard } from '@repo/analytics'

const customDashboard = {
  id: 'custom-dashboard',
  name: 'Custom Dashboard',
  widgets: [
    {
      id: 'traffic-chart',
      type: 'chart',
      title: 'Traffic Overview',
      config: {
        chartType: 'line',
        metrics: ['pageviews', 'users']
      }
    },
    {
      id: 'conversion-metric',
      type: 'metric',
      title: 'Conversion Rate',
      config: {
        metrics: ['conversion_rate']
      }
    }
  ]
}

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1>Analytics Dashboard</h1>
      <AnalyticsDashboard dashboard={customDashboard} />
    </div>
  )
}
```

### Event Tracking

```tsx
// components/signup-form.tsx
import { useAnalytics } from '@repo/analytics'

export function SignupForm() {
  const analytics = useAnalytics()

  const handleSubmit = async (formData) => {
    try {
      await submitForm(formData)
      
      // Track successful signup
      analytics.capture('user_signup', {
        method: 'email',
        source: 'homepage',
        plan: formData.plan
      })
    } catch (error) {
      // Track signup error
      analytics.capture('signup_error', {
        error: error.message,
        method: 'email'
      })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  )
}
```

## License

MIT License - see LICENSE file for details. 