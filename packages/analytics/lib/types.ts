// Core Analytics Types
export interface AnalyticsEvent {
  id: string
  event: string
  timestamp: Date
  userId?: string
  sessionId?: string
  properties: Record<string, any>
  distinctId?: string
  deviceId?: string
  userAgent?: string
  ip?: string
  country?: string
  city?: string
  referrer?: string
  utm?: {
    source?: string
    medium?: string
    campaign?: string
    term?: string
    content?: string
  }
}

export interface AnalyticsMetric {
  id: string
  name: string
  value: number
  unit: string
  timestamp: Date
  period: AnalyticsPeriod
  change?: number
  changePercent?: number
  target?: number
  status: 'up' | 'down' | 'neutral'
  category: MetricCategory
}

export type AnalyticsPeriod = 
  | 'hour' 
  | 'day' 
  | 'week' 
  | 'month' 
  | 'quarter' 
  | 'year'
  | 'all-time'

export type MetricCategory = 
  | 'traffic'
  | 'engagement'
  | 'conversion'
  | 'revenue'
  | 'content'
  | 'user'
  | 'performance'
  | 'seo'

// Dashboard Types
export interface AnalyticsDashboard {
  id: string
  name: string
  description?: string
  widgets: DashboardWidget[]
  layout: DashboardLayout
  filters: DashboardFilter[]
  dateRange: DateRange
  userId?: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface DashboardWidget {
  id: string
  type: WidgetType
  title: string
  description?: string
  config: WidgetConfig
  position: WidgetPosition
  size: WidgetSize
  dataSource: string
  refreshInterval?: number
}

export type WidgetType = 
  | 'chart'
  | 'metric'
  | 'table'
  | 'funnel'
  | 'heatmap'
  | 'geo'
  | 'realtime'
  | 'custom'

export interface WidgetConfig {
  chartType?: ChartType
  metrics: string[]
  dimensions?: string[]
  filters?: AnalyticsFilter[]
  groupBy?: string[]
  sortBy?: AnalyticsSort[]
  limit?: number
  showComparison?: boolean
  comparisonPeriod?: AnalyticsPeriod
}

export type ChartType = 
  | 'line'
  | 'bar'
  | 'pie'
  | 'donut'
  | 'area'
  | 'scatter'
  | 'funnel'
  | 'heatmap'

export interface WidgetPosition {
  x: number
  y: number
}

export interface WidgetSize {
  width: number
  height: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
}

export interface DashboardLayout {
  columns: number
  rowHeight: number
  margin: [number, number]
  containerPadding: [number, number]
  breakpoints: Record<string, number>
  cols: Record<string, number>
}

export interface DashboardFilter {
  id: string
  field: string
  operator: FilterOperator
  value: any
  label?: string
}

export type FilterOperator = 
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'less_than'
  | 'greater_than_or_equal'
  | 'less_than_or_equal'
  | 'in'
  | 'not_in'
  | 'is_null'
  | 'is_not_null'

export interface DateRange {
  start: Date
  end: Date
  preset?: DateRangePreset
}

export type DateRangePreset = 
  | 'today'
  | 'yesterday'
  | 'last-7-days'
  | 'last-30-days'
  | 'last-90-days'
  | 'this-week'
  | 'last-week'
  | 'this-month'
  | 'last-month'
  | 'this-quarter'
  | 'last-quarter'
  | 'this-year'
  | 'last-year'
  | 'custom'

// Content Analytics Types
export interface ContentAnalytics {
  id: string
  contentId: string
  contentType: string
  title: string
  slug: string
  publishedAt: Date
  metrics: ContentMetrics
  performance: ContentPerformance
  seo: ContentSEOMetrics
  engagement: ContentEngagement
  conversion: ContentConversion
}

export interface ContentMetrics {
  views: number
  uniqueViews: number
  pageviews: number
  uniquePageviews: number
  bounceRate: number
  avgTimeOnPage: number
  avgSessionDuration: number
  exitRate: number
}

export interface ContentPerformance {
  shares: number
  likes: number
  comments: number
  bookmarks: number
  downloads: number
  clicks: number
  impressions: number
  ctr: number
  engagementRate: number
}

export interface ContentSEOMetrics {
  organicTraffic: number
  keywords: KeywordMetric[]
  backlinks: number
  domainAuthority?: number
  pageAuthority?: number
  serp: SERPMetric[]
}

export interface KeywordMetric {
  keyword: string
  position: number
  volume: number
  difficulty: number
  traffic: number
  clicks: number
  impressions: number
  ctr: number
}

export interface SERPMetric {
  keyword: string
  position: number
  url: string
  title: string
  description: string
  clickThrough: number
}

export interface ContentEngagement {
  scrollDepth: number
  timeOnPage: number
  interactionEvents: number
  socialShares: number
  commentCount: number
  reactionCount: number
}

export interface ContentConversion {
  conversions: number
  conversionRate: number
  revenue: number
  goalCompletions: ConversionGoal[]
  funnelSteps: FunnelStep[]
}

// User Analytics Types
export interface UserAnalytics {
  id: string
  userId: string
  profile: UserProfile
  behavior: UserBehavior
  engagement: UserEngagement
  journey: UserJourney
  segments: UserSegment[]
  lifetime: UserLifetime
}

export interface UserProfile {
  id: string
  email?: string
  name?: string
  avatar?: string
  createdAt: Date
  lastActiveAt: Date
  status: 'active' | 'inactive' | 'churned'
  tier?: 'free' | 'premium' | 'enterprise'
  location?: UserLocation
  device?: DeviceInfo
  acquisition: AcquisitionInfo
}

export interface UserLocation {
  country: string
  city: string
  region: string
  timezone: string
  coordinates?: [number, number]
}

export interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet'
  os: string
  browser: string
  version: string
  screenSize: string
  userAgent: string
}

export interface AcquisitionInfo {
  source: string
  medium: string
  campaign?: string
  referrer?: string
  firstVisit: Date
  acquisitionCost?: number
}

export interface UserBehavior {
  sessions: number
  avgSessionDuration: number
  pageviews: number
  uniquePageviews: number
  bounceRate: number
  returnVisitor: boolean
  frequency: VisitFrequency
  recency: number
  preferredTime: string
  preferredDay: string
}

export type VisitFrequency = 
  | 'first-time'
  | 'returning'
  | 'frequent'
  | 'loyal'
  | 'at-risk'
  | 'dormant'

export interface UserEngagement {
  engagementScore: number
  interactionEvents: number
  contentViewed: number
  timeSpent: number
  featuresUsed: string[]
  lastEngagement: Date
  engagementTrend: 'increasing' | 'decreasing' | 'stable'
}

export interface UserJourney {
  touchpoints: Touchpoint[]
  funnelSteps: FunnelStep[]
  conversions: ConversionEvent[]
  dropoffPoints: DropoffPoint[]
  pathAnalysis: PathStep[]
}

export interface Touchpoint {
  id: string
  timestamp: Date
  type: 'pageview' | 'event' | 'conversion'
  page?: string
  event?: string
  properties: Record<string, any>
  channel: string
  campaign?: string
}

export interface FunnelStep {
  step: number
  name: string
  users: number
  conversionRate: number
  dropoffRate: number
  avgTimeToNext?: number
}

export interface ConversionEvent {
  id: string
  goal: string
  timestamp: Date
  value?: number
  properties: Record<string, any>
  attribution: AttributionInfo
}

export interface AttributionInfo {
  firstTouch: TouchpointAttribution
  lastTouch: TouchpointAttribution
  multiTouch: TouchpointAttribution[]
}

export interface TouchpointAttribution {
  channel: string
  source: string
  medium: string
  campaign?: string
  weight: number
  value: number
}

export interface DropoffPoint {
  step: string
  page?: string
  event?: string
  dropoffRate: number
  reasons?: string[]
}

export interface PathStep {
  page: string
  order: number
  users: number
  nextPages: { page: string; users: number; rate: number }[]
  prevPages: { page: string; users: number; rate: number }[]
}

export interface UserSegment {
  id: string
  name: string
  description?: string
  criteria: SegmentCriteria[]
  userCount: number
  createdAt: Date
  updatedAt: Date
}

export interface SegmentCriteria {
  field: string
  operator: FilterOperator
  value: any
  type: 'behavioral' | 'demographic' | 'technographic' | 'psychographic'
}

export interface UserLifetime {
  value: number
  revenue: number
  duration: number
  predicted: {
    value: number
    revenue: number
    duration: number
    churnProbability: number
  }
}

// A/B Testing Types
export interface ABTest {
  id: string
  name: string
  description?: string
  status: TestStatus
  type: TestType
  variants: TestVariant[]
  traffic: number
  startDate: Date
  endDate?: Date
  winner?: string
  confidence: number
  significance: number
  metrics: TestMetric[]
  segments?: string[]
  hypothesis: string
  conclusion?: string
}

export type TestStatus = 
  | 'draft'
  | 'running'
  | 'paused'
  | 'completed'
  | 'stopped'

export type TestType = 
  | 'split'
  | 'multivariate'
  | 'redirect'
  | 'server-side'

export interface TestVariant {
  id: string
  name: string
  description?: string
  traffic: number
  isControl: boolean
  config: Record<string, any>
  metrics: VariantMetrics
}

export interface VariantMetrics {
  users: number
  conversions: number
  conversionRate: number
  revenue?: number
  significance: number
  improvement: number
  confidence: number
}

export interface TestMetric {
  id: string
  name: string
  type: 'primary' | 'secondary'
  goal: 'increase' | 'decrease'
  value: number
  baseline?: number
  target?: number
}

// Export and API Types
export interface AnalyticsExport {
  id: string
  name: string
  type: ExportType
  format: ExportFormat
  data: ExportData
  filters?: AnalyticsFilter[]
  dateRange: DateRange
  status: ExportStatus
  downloadUrl?: string
  createdAt: Date
  expiresAt?: Date
  size?: number
  rowCount?: number
}

export type ExportType = 
  | 'events'
  | 'users'
  | 'content'
  | 'conversions'
  | 'sessions'
  | 'custom'

export type ExportFormat = 
  | 'csv'
  | 'json'
  | 'xlsx'
  | 'pdf'

export interface ExportData {
  fields: string[]
  query: string
  parameters: Record<string, any>
}

export type ExportStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'expired'

export interface AnalyticsFilter {
  field: string
  operator: FilterOperator
  value: any
  type: 'string' | 'number' | 'date' | 'boolean' | 'array'
}

export interface AnalyticsSort {
  field: string
  direction: 'asc' | 'desc'
}

export interface AnalyticsQuery {
  metrics: string[]
  dimensions?: string[]
  filters?: AnalyticsFilter[]
  dateRange: DateRange
  groupBy?: string[]
  orderBy?: AnalyticsSort[]
  limit?: number
  offset?: number
}

export interface AnalyticsResponse<T = any> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    hasMore: boolean
  }
  query: AnalyticsQuery
  executionTime: number
}

// Real-time Analytics Types
export interface RealtimeMetrics {
  activeUsers: number
  pageviews: number
  events: number
  conversions: number
  revenue: number
  topPages: PageMetric[]
  topEvents: EventMetric[]
  userLocations: LocationMetric[]
  deviceBreakdown: DeviceMetric[]
  trafficSources: SourceMetric[]
  timestamp: Date
}

export interface PageMetric {
  page: string
  title: string
  views: number
  users: number
  avgTimeOnPage: number
}

export interface EventMetric {
  event: string
  count: number
  users: number
  conversionRate?: number
}

export interface LocationMetric {
  country: string
  users: number
  percentage: number
}

export interface DeviceMetric {
  device: string
  users: number
  percentage: number
}

export interface SourceMetric {
  source: string
  users: number
  percentage: number
}

// Revenue Analytics Types
export interface RevenueAnalytics {
  id: string
  period: AnalyticsPeriod
  metrics: RevenueMetrics
  breakdown: RevenueBreakdown
  cohorts: CohortAnalysis[]
  subscriptions: SubscriptionMetrics
  churn: ChurnAnalysis
  forecasting: RevenueForecast
}

export interface RevenueMetrics {
  total: number
  recurring: number
  oneTime: number
  refunds: number
  net: number
  growth: number
  growthRate: number
  arpu: number
  arpc: number
  ltv: number
  cac: number
  ltvCacRatio: number
}

export interface RevenueBreakdown {
  byPlan: { plan: string; revenue: number; users: number }[]
  byChannel: { channel: string; revenue: number; users: number }[]
  byGeo: { country: string; revenue: number; users: number }[]
  byDevice: { device: string; revenue: number; users: number }[]
}

export interface CohortAnalysis {
  period: string
  cohortSize: number
  retention: number[]
  revenue: number[]
  ltv: number
}

export interface SubscriptionMetrics {
  active: number
  new: number
  churned: number
  reactivated: number
  upgraded: number
  downgraded: number
  mrr: number
  arr: number
  churnRate: number
  upgradePath: string[]
}

export interface ChurnAnalysis {
  rate: number
  predicted: number
  reasons: { reason: string; percentage: number }[]
  riskSegments: { segment: string; risk: number; users: number }[]
  preventionActions: string[]
}

export interface RevenueForecast {
  predicted: number
  confidence: number
  factors: ForecastFactor[]
  scenarios: ForecastScenario[]
}

export interface ForecastFactor {
  factor: string
  impact: number
  confidence: number
}

export interface ForecastScenario {
  name: string
  probability: number
  revenue: number
  assumptions: string[]
}

// Goal and Conversion Types
export interface ConversionGoal {
  id: string
  name: string
  description?: string
  type: GoalType
  conditions: GoalCondition[]
  value?: number
  currency?: string
  funnelSteps?: FunnelStep[]
  isActive: boolean
  createdAt: Date
}

export type GoalType = 
  | 'pageview'
  | 'event'
  | 'revenue'
  | 'engagement'
  | 'custom'

export interface GoalCondition {
  field: string
  operator: FilterOperator
  value: any
}

// Configuration Types
export interface AnalyticsConfig {
  providers: AnalyticsProvider[]
  tracking: TrackingConfig
  privacy: PrivacyConfig
  export: ExportConfig
  dashboard: DashboardConfig
  alerts: AlertConfig
}

export interface AnalyticsProvider {
  name: string
  enabled: boolean
  config: Record<string, any>
  dataRetention?: number
}

export interface TrackingConfig {
  autotrack: boolean
  pageviews: boolean
  clicks: boolean
  forms: boolean
  errors: boolean
  performance: boolean
  customEvents: string[]
  excludePaths: string[]
  cookieDomain?: string
  sessionTimeout: number
}

export interface PrivacyConfig {
  anonymizeIp: boolean
  respectDnt: boolean
  consentRequired: boolean
  dataRetention: number
  allowedDomains: string[]
  blockedCountries: string[]
}

export interface ExportConfig {
  maxRows: number
  formats: ExportFormat[]
  retention: number
  rateLimits: {
    perHour: number
    perDay: number
  }
}

export interface DashboardConfig {
  refreshInterval: number
  maxWidgets: number
  allowPublicDashboards: boolean
  defaultDateRange: DateRangePreset
}

export interface AlertConfig {
  enabled: boolean
  channels: AlertChannel[]
  rules: AlertRule[]
}

export interface AlertChannel {
  type: 'email' | 'slack' | 'webhook'
  config: Record<string, any>
}

export interface AlertRule {
  id: string
  name: string
  metric: string
  condition: FilterOperator
  threshold: number
  period: AnalyticsPeriod
  channels: string[]
  isActive: boolean
} 