# @repo/admin

A comprehensive admin package for Next.js applications with TypeScript support. This package provides a complete admin interface with components, hooks, and utilities for managing users, content, analytics, and system settings.

## Features

- 🎨 **Modern UI Components** - Built with Radix UI and Tailwind CSS
- 🔐 **Permission-based Access Control** - Granular permissions and role management
- 📊 **Analytics Dashboard** - Real-time metrics and charts
- 🔔 **Notification System** - Toast notifications and activity feeds
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎯 **Type Safety** - Full TypeScript support with comprehensive types
- 🧪 **Well Tested** - Comprehensive test coverage
- 📋 **Data Tables** - Advanced table components with sorting, filtering, and pagination
- 🎭 **Theming Support** - Light/dark mode with customizable themes

## Installation

```bash
npm install @repo/admin
```

## Quick Start

### 1. Wrap your app with AdminProvider

```tsx
import { AdminProvider } from '@repo/admin'
import type { AdminUser } from '@repo/admin'

const adminUser: AdminUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  roles: [{ 
    id: 'admin', 
    name: 'Admin', 
    description: 'Administrator',
    permissions: ['admin.read', 'admin.write', 'users.read', 'users.write']
  }],
  permissions: ['admin.read', 'admin.write', 'users.read', 'users.write'],
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
}

function App() {
  return (
    <AdminProvider defaultUser={adminUser}>
      <YourApp />
    </AdminProvider>
  )
}
```

### 2. Use Admin Components

```tsx
import { AdminLayout, AdminTrigger } from '@repo/admin'

function Dashboard() {
  return (
    <AdminLayout 
      title="Dashboard" 
      description="Welcome to your admin dashboard"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Your dashboard content */}
      </div>
      
      {/* Admin trigger button */}
      <AdminTrigger />
    </AdminLayout>
  )
}
```

### 3. Use Admin Hooks

```tsx
import { useAdmin, useAdminPermissions, useAdminNotifications } from '@repo/admin'

function UserManagement() {
  const { currentUser } = useAdmin()
  const { canWrite } = useAdminPermissions()
  const { notifySuccess } = useAdminNotifications()

  const handleCreateUser = async () => {
    if (!canWrite('users')) {
      notifyError('Permission Denied', 'You cannot create users')
      return
    }

    try {
      // Create user logic
      notifySuccess('Success', 'User created successfully')
    } catch (error) {
      notifyError('Error', 'Failed to create user')
    }
  }

  return (
    <div>
      <h1>User Management</h1>
      {canWrite('users') && (
        <button onClick={handleCreateUser}>Create User</button>
      )}
    </div>
  )
}
```

## Components

### AdminLayout

A comprehensive layout component for admin pages.

```tsx
import { AdminLayout } from '@repo/admin'

<AdminLayout 
  title="Page Title"
  description="Page description"
  actions={<button>Action Button</button>}
>
  <YourContent />
</AdminLayout>
```

### AdminTable

Advanced data table with sorting, filtering, and pagination.

```tsx
import { AdminTable, createSortableHeader, createActionMenu } from '@repo/admin'
import { Edit, Trash } from 'lucide-react'

const columns = [
  {
    accessorKey: 'name',
    header: createSortableHeader('Name'),
  },
  {
    accessorKey: 'email',
    header: createSortableHeader('Email'),
  },
  {
    id: 'actions',
    cell: createActionMenu([
      {
        label: 'Edit',
        icon: Edit,
        onClick: (row) => console.log('Edit', row),
      },
      {
        label: 'Delete',
        icon: Trash,
        onClick: (row) => console.log('Delete', row),
      },
    ]),
  },
]

<AdminTable
  columns={columns}
  data={users}
  searchable
  exportable
  selectable
  onSelectionChange={(selected) => console.log(selected)}
/>
```

### AdminNavigation

Sidebar navigation with permission-based visibility.

```tsx
import { AdminNavigation } from '@repo/admin'

const customNavItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
    permissions: ['admin.read'],
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    href: '/admin/users',
    permissions: ['users.read'],
    badge: '125',
  },
]

<AdminNavigation navItems={customNavItems} />
```

## Hooks

### useAdmin

Main hook for admin state management.

```tsx
const {
  isOpen,
  currentUser,
  notifications,
  openAdmin,
  closeAdmin,
  addNotification,
  hasPermission,
} = useAdmin()
```

### useAdminPermissions

Hook for permission checking.

```tsx
const {
  canRead,
  canWrite,
  canDelete,
  isAdmin,
  isSuperAdmin,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
} = useAdminPermissions()
```

### useAdminAnalytics

Hook for analytics data.

```tsx
const {
  metrics,
  charts,
  loading,
  error,
  refreshAnalytics,
  getMetric,
  getChart,
} = useAdminAnalytics({ autoRefresh: true })
```

### useAdminNotifications

Hook for notification management.

```tsx
const {
  notifications,
  unreadCount,
  addNotification,
  markAsRead,
  clearAll,
  notifySuccess,
  notifyError,
  notifyWarning,
  notifyInfo,
} = useAdminNotifications()
```

## Types

The package exports comprehensive TypeScript types:

```tsx
import type {
  AdminUser,
  AdminRole,
  AdminPermission,
  AdminNotification,
  AdminMetric,
  AdminChart,
  AdminNavItem,
  AdminTableColumn,
  // ... and many more
} from '@repo/admin'
```

## Permissions

The package uses a granular permission system:

- `admin.read` - Read admin data
- `admin.write` - Write admin data
- `admin.delete` - Delete admin data
- `users.read` - Read user data
- `users.write` - Write user data
- `users.delete` - Delete user data
- `content.read` - Read content
- `content.write` - Write content
- `content.delete` - Delete content
- `content.publish` - Publish content
- `analytics.read` - Read analytics
- `settings.read` - Read settings
- `settings.write` - Write settings
- `webhooks.read` - Read webhooks
- `webhooks.write` - Write webhooks
- `database.read` - Read database
- `database.write` - Write database

## Styling

The package uses Tailwind CSS for styling. Make sure to include the package in your Tailwind config:

```js
module.exports = {
  content: [
    './node_modules/@repo/admin/**/*.{js,ts,jsx,tsx}',
    // ... your other content
  ],
  // ... rest of config
}
```

## Testing

Run tests with:

```bash
npm test
```

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure TypeScript types are correct

## License

MIT
