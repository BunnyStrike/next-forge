import type { ReactNode } from 'react'

// ===== CORE ADMIN TYPES =====

export type AdminContent = {
  id: string
  type: 'text' | 'image' | 'rich-text' | 'link' | 'button'
  label: string
  value: string
  metadata?: Record<string, any>
}

export type AdminCollection = {
  id: string
  name: string
  slug: string
  fields: AdminField[]
  items: AdminCollectionItem[]
}

export type AdminField = {
  id: string
  name: string
  type:
    | 'text'
    | 'textarea'
    | 'rich-text'
    | 'image'
    | 'date'
    | 'boolean'
    | 'select'
    | 'number'
    | 'email'
    | 'url'
    | 'file'
  required?: boolean
  options?: string[] // for select fields
  validation?: Record<string, any>
  description?: string
  placeholder?: string
}

export type AdminCollectionItem = {
  id: string
  collectionId: string
  data: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

// ===== USER MANAGEMENT TYPES =====

export type AdminPermission = 
  | 'admin.read'
  | 'admin.write'
  | 'admin.delete'
  | 'users.read'
  | 'users.write'
  | 'users.delete'
  | 'content.read'
  | 'content.write'
  | 'content.delete'
  | 'content.publish'
  | 'analytics.read'
  | 'settings.read'
  | 'settings.write'
  | 'webhooks.read'
  | 'webhooks.write'
  | 'database.read'
  | 'database.write'

export type AdminRole = {
  id: string
  name: string
  description: string
  permissions: AdminPermission[]
  isSystem?: boolean
}

export type AdminUser = {
  id: string
  name: string
  email: string
  roles: AdminRole[]
  permissions: AdminPermission[]
  isActive: boolean
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

// ===== ANALYTICS TYPES =====

export type AdminMetric = {
  id: string
  name: string
  value: number | string
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  format?: 'number' | 'percentage' | 'currency' | 'duration'
  period?: string
}

export type AdminChart = {
  id: string
  type: 'line' | 'bar' | 'area' | 'pie' | 'donut'
  title: string
  data: Record<string, any>[]
  xKey?: string
  yKey?: string
  categories?: string[]
}

// ===== SYSTEM TYPES =====

export type AdminSystemHealth = {
  status: 'healthy' | 'warning' | 'critical'
  uptime: number
  services: AdminServiceStatus[]
  lastChecked: Date
}

export type AdminServiceStatus = {
  name: string
  status: 'operational' | 'degraded' | 'down'
  responseTime?: number
  lastChecked: Date
}

export type AdminNotification = {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  actions?: AdminNotificationAction[]
  isRead: boolean
  createdAt: Date
}

export type AdminNotificationAction = {
  label: string
  action: () => void
  variant?: 'primary' | 'secondary' | 'destructive'
}

// ===== COMPONENT TYPES =====

export type AdminContextType = {
  // State
  isOpen: boolean
  activeTab: AdminTab
  selectedContent: AdminContent | null
  selectedCollection: AdminCollection | null
  currentUser: AdminUser | null
  notifications: AdminNotification[]
  systemHealth: AdminSystemHealth | null
  
  // Actions
  openAdmin: () => void
  closeAdmin: () => void
  setActiveTab: (tab: AdminTab) => void
  setSelectedContent: (content: AdminContent | null) => void
  setSelectedCollection: (collection: AdminCollection | null) => void
  
  // Content Management
  updateContent: (id: string, updates: Partial<AdminContent>) => Promise<void>
  createCollectionItem: (collectionId: string, data: Record<string, any>) => Promise<void>
  updateCollectionItem: (id: string, data: Record<string, any>) => Promise<void>
  deleteCollectionItem: (id: string) => Promise<void>
  
  // User Management
  createUser: (user: Omit<AdminUser, 'id' | 'createdAt' | 'updatedAt'>) => Promise<AdminUser>
  updateUser: (id: string, updates: Partial<AdminUser>) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  
  // Notifications
  addNotification: (notification: Omit<AdminNotification, 'id' | 'createdAt'>) => void
  markNotificationAsRead: (id: string) => void
  clearNotifications: () => void
  
  // System
  refreshSystemHealth: () => Promise<void>
  hasPermission: (permission: AdminPermission) => boolean
}

export type AdminTab = 
  | 'dashboard'
  | 'users'
  | 'content'
  | 'collections'
  | 'analytics'
  | 'settings'
  | 'webhooks'
  | 'system'
  | 'security'

export type AdminPageProps = {
  children?: ReactNode
  title?: string
  description?: string
  actions?: ReactNode
}

export type AdminTableColumn<T = any> = {
  id: string
  header: string
  accessorKey?: keyof T
  cell?: (props: { row: { original: T } }) => ReactNode
  sortable?: boolean
  filterable?: boolean
  width?: number | string
}

export type AdminFormField = {
  name: string
  label: string
  type: AdminField['type']
  required?: boolean
  validation?: any
  options?: string[]
  description?: string
  placeholder?: string
}

export type AdminFormSchema = {
  fields: AdminFormField[]
  onSubmit: (data: Record<string, any>) => void | Promise<void>
  defaultValues?: Record<string, any>
  mode?: 'create' | 'edit'
}

// ===== NAVIGATION TYPES =====

export type AdminNavItem = {
  id: string
  label: string
  icon?: any
  href?: string
  tab?: AdminTab
  children?: AdminNavItem[]
  permissions?: AdminPermission[]
  badge?: string | number
}

export type AdminBreadcrumb = {
  label: string
  href?: string
  isActive?: boolean
}

// ===== FILTER AND SEARCH TYPES =====

export type AdminFilter = {
  id: string
  type: 'text' | 'select' | 'date' | 'boolean' | 'number'
  label: string
  value: any
  options?: { label: string; value: any }[]
}

export type AdminSort = {
  field: string
  direction: 'asc' | 'desc'
}

export type AdminPagination = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export type AdminListParams = {
  filters?: AdminFilter[]
  sort?: AdminSort
  pagination?: Partial<AdminPagination>
  search?: string
}

// ===== API TYPES =====

export type AdminApiResponse<T = any> = {
  data: T
  meta?: {
    pagination?: AdminPagination
    filters?: AdminFilter[]
    sort?: AdminSort
  }
}

export type AdminApiError = {
  message: string
  code?: string
  details?: Record<string, any>
}

// ===== SETTINGS TYPES =====

export type AdminSetting = {
  id: string
  category: string
  key: string
  value: any
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  label: string
  description?: string
  validation?: any
  isSecret?: boolean
}

export type AdminSettingsCategory = {
  id: string
  label: string
  description?: string
  settings: AdminSetting[]
}
