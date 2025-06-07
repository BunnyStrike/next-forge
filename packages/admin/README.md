# @repo/admin

A comprehensive admin package that provides content and collection management capabilities via a sliding sidebar interface. Can be easily integrated into any Next.js application within the monorepo.

## Features

- **Sliding Sidebar Interface** - Right-side sliding admin panel
- **Content Management** - Edit page content inline
- **Collection Management** - Manage data collections and items
- **Type-Safe** - Full TypeScript support
- **Design System Integration** - Uses the shared design system
- **Authentication Ready** - Integrates with the auth package
- **Responsive** - Works on all screen sizes

## Installation

The package is already included in the monorepo. Import it in your app:

```tsx
import { AdminProvider, AdminSidebar, AdminTrigger } from '@repo/admin'
```

## Basic Setup

### 1. Wrap your app with AdminProvider

```tsx
import { AdminProvider } from '@repo/admin'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AdminProvider>{children}</AdminProvider>
      </body>
    </html>
  )
}
```

### 2. Add the AdminSidebar and AdminTrigger

```tsx
import { AdminSidebar, AdminTrigger } from '@repo/admin'

export default function Layout({ children }) {
  return (
    <>
      {children}

      {/* Floating admin trigger button */}
      <div className='fixed bottom-4 right-4 z-30'>
        <AdminTrigger />
      </div>

      {/* Admin sidebar */}
      <AdminSidebar />
    </>
  )
}
```

## Components

### AdminProvider

Provides admin context to child components.

```tsx
<AdminProvider>{/* Your app */}</AdminProvider>
```

### AdminTrigger

Button to open the admin panel.

```tsx
<AdminTrigger variant='outline' size='icon' className='custom-class' />
```

### AdminSidebar

The main admin interface that slides from the right.

```tsx
<AdminSidebar />
```

### ContentManager

Interface for managing page content (available within AdminSidebar).

### CollectionManager

Interface for managing data collections (available within AdminSidebar).

## Usage with Auth

The admin package is designed to work with the auth package. Wrap the admin components with authentication checks:

```tsx
import { useUser } from '@repo/auth'
import { AdminTrigger, AdminSidebar } from '@repo/admin'

export default function AdminComponents() {
  const { user } = useUser()

  // Only show admin to authenticated users with admin permissions
  if (!user || !user.permissions?.includes('admin')) {
    return null
  }

  return (
    <>
      <AdminTrigger />
      <AdminSidebar />
    </>
  )
}
```

## Customization

### Custom Content Types

Extend the AdminContent type to add your own content types:

```tsx
import type { AdminContent } from '@repo/admin'

type CustomContent = AdminContent & {
  type: 'text' | 'image' | 'rich-text' | 'video' | 'gallery'
}
```

### Custom Collections

Define your own collection schemas:

```tsx
import type { AdminCollection } from '@repo/admin'

const blogCollection: AdminCollection = {
  id: 'blog',
  name: 'Blog Posts',
  slug: 'blog-posts',
  fields: [
    { id: '1', name: 'title', type: 'text', required: true },
    { id: '2', name: 'content', type: 'rich-text', required: true },
    { id: '3', name: 'published', type: 'boolean', required: false },
    {
      id: '4',
      name: 'category',
      type: 'select',
      options: ['Tech', 'Design', 'Business'],
    },
  ],
  items: [],
}
```

## API Integration

The admin package includes placeholder functions for API integration. Replace these with your actual API calls:

```tsx
// In your AdminProvider implementation
const updateContent = async (id: string, updates: Partial<AdminContent>) => {
  const response = await fetch(`/api/content/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  return response.json()
}
```

## Styling

The admin package uses the design system components and follows the same theming. All components are fully styled and responsive out of the box.

## Examples

### Development Mode Only

Show admin controls only in development:

```tsx
const isDev = process.env.NODE_ENV === 'development'

return (
  <>
    {children}
    {isDev && (
      <>
        <AdminTrigger />
        <AdminSidebar />
      </>
    )}
  </>
)
```

### Custom Trigger

Create a custom trigger button:

```tsx
import { useAdmin } from '@repo/admin'

function CustomAdminButton() {
  const { openAdmin } = useAdmin()

  return (
    <button onClick={openAdmin} className='admin-button'>
      Open Admin Panel
    </button>
  )
}
```

## TypeScript Support

The package is fully typed. Import types as needed:

```tsx
import type {
  AdminContent,
  AdminCollection,
  AdminContextType,
} from '@repo/admin'
```
