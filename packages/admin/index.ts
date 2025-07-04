// ===== COMPONENTS =====
export { AdminProvider } from './components/admin-provider'
export { AdminSidebar } from './components/admin-sidebar'
export { AdminTrigger } from './components/admin-trigger'
export { AdminNavigation } from './components/admin-navigation'
// export { AdminLayout } from './components/admin-layout' // TODO: Implement
export { AdminBreadcrumbs } from './components/admin-breadcrumbs'
export { AdminNotifications } from './components/admin-notifications'
export { AdminTable, createSortableHeader, createActionMenu } from './components/admin-table'
export { ContentManager } from './components/content-manager'
export { CollectionManager } from './components/collection-manager'

// ===== HOOKS =====
export { useAdmin, AdminContext } from './hooks/use-admin'
export { useAdminPermissions } from './hooks/use-admin-permissions'
// export { useAdminAnalytics } from './hooks/use-admin-analytics' // TODO: Implement
export { useAdminNotifications } from './hooks/use-admin-notifications'

// ===== TYPES =====
export type {
  // Core Types
  AdminContent,
  AdminCollection,
  AdminField,
  AdminCollectionItem,
  
  // User Management Types
  AdminPermission,
  AdminRole,
  AdminUser,
  
  // Analytics Types
  AdminMetric,
  AdminChart,
  
  // System Types
  AdminSystemHealth,
  AdminServiceStatus,
  AdminNotification,
  AdminNotificationAction,
  
  // Component Types
  AdminContextType,
  AdminTab,
  AdminPageProps,
  AdminTableColumn,
  AdminFormField,
  AdminFormSchema,
  
  // Navigation Types
  AdminNavItem,
  AdminBreadcrumb,
  
  // Filter and Search Types
  AdminFilter,
  AdminSort,
  AdminPagination,
  AdminListParams,
  
  // API Types
  AdminApiResponse,
  AdminApiError,
  
  // Settings Types
  AdminSetting,
  AdminSettingsCategory,
} from './lib/types'
