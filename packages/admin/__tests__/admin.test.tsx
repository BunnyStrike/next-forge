import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { render, screen, fireEvent } from '@testing-library/react'
import { 
  AdminProvider, 
  useAdmin, 
  useAdminPermissions, 
  useAdminNotifications,
  AdminTrigger,
  AdminBreadcrumbs
} from '../index'
import type { AdminUser } from '../lib/types'

// Mock user for testing
const mockUser: AdminUser = {
  id: 'test-user-1',
  name: 'Test Admin',
  email: 'admin@test.com',
  roles: [
    {
      id: 'admin-role',
      name: 'Admin',
      description: 'Administrator role',
      permissions: ['admin.read', 'admin.write', 'users.read', 'users.write']
    }
  ],
  permissions: ['admin.read', 'admin.write', 'users.read', 'users.write'],
  isActive: true,
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01')
}

describe('AdminProvider', () => {
  it('should provide admin context', () => {
    const { result } = renderHook(() => useAdmin(), {
      wrapper: ({ children }) => (
        <AdminProvider defaultUser={mockUser}>
          {children}
        </AdminProvider>
      ),
    })

    expect(result.current.currentUser).toEqual(mockUser)
    expect(result.current.isOpen).toBe(false)
    expect(result.current.activeTab).toBe('dashboard')
  })

  it('should throw error when used outside provider', () => {
    const { result } = renderHook(() => useAdmin())
    expect(result.error).toBeDefined()
  })

  it('should toggle admin panel', () => {
    const { result } = renderHook(() => useAdmin(), {
      wrapper: ({ children }) => (
        <AdminProvider>
          {children}
        </AdminProvider>
      ),
    })

    expect(result.current.isOpen).toBe(false)

    act(() => {
      result.current.openAdmin()
    })

    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.closeAdmin()
    })

    expect(result.current.isOpen).toBe(false)
  })
})

describe('useAdminPermissions', () => {
  it('should check permissions correctly', () => {
    const { result } = renderHook(() => useAdminPermissions(), {
      wrapper: ({ children }) => (
        <AdminProvider defaultUser={mockUser}>
          {children}
        </AdminProvider>
      ),
    })

    expect(result.current.canRead('admin')).toBe(true)
    expect(result.current.canWrite('admin')).toBe(true)
    expect(result.current.canRead('content')).toBe(false)
    expect(result.current.isAdmin()).toBe(true)
  })

  it('should handle user without permissions', () => {
    const { result } = renderHook(() => useAdminPermissions(), {
      wrapper: ({ children }) => (
        <AdminProvider defaultUser={null}>
          {children}
        </AdminProvider>
      ),
    })

    expect(result.current.canRead('admin')).toBe(false)
    expect(result.current.isAdmin()).toBe(false)
    expect(result.current.permissions).toEqual([])
  })
})

describe('useAdminNotifications', () => {
  it('should manage notifications', () => {
    const { result } = renderHook(() => useAdminNotifications())

    expect(result.current.notifications).toEqual([])
    expect(result.current.unreadCount).toBe(0)

    act(() => {
      result.current.notifySuccess('Test Title', 'Test message')
    })

    expect(result.current.notifications).toHaveLength(1)
    expect(result.current.unreadCount).toBe(1)
    expect(result.current.notifications[0].type).toBe('success')
    expect(result.current.notifications[0].title).toBe('Test Title')

    act(() => {
      result.current.markAsRead(result.current.notifications[0].id)
    })

    expect(result.current.unreadCount).toBe(0)
  })

  it('should auto-remove success notifications', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useAdminNotifications())

    act(() => {
      result.current.notifySuccess('Test', 'Message')
    })

    expect(result.current.notifications).toHaveLength(1)

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.notifications).toHaveLength(0)
    vi.useRealTimers()
  })
})

describe('AdminTrigger', () => {
  it('should render trigger button', () => {
    render(
      <AdminProvider>
        <AdminTrigger />
      </AdminProvider>
    )

    const trigger = screen.getByRole('button')
    expect(trigger).toBeInTheDocument()
  })

  it('should open admin panel when clicked', () => {
    let adminOpen = false
    const TestComponent = () => {
      const { isOpen, openAdmin } = useAdmin()
      adminOpen = isOpen
      return <button onClick={openAdmin}>Open Admin</button>
    }

    render(
      <AdminProvider>
        <TestComponent />
      </AdminProvider>
    )

    const button = screen.getByText('Open Admin')
    fireEvent.click(button)
    
    expect(adminOpen).toBe(true)
  })
})

describe('AdminBreadcrumbs', () => {
  it('should render default breadcrumbs', () => {
    render(<AdminBreadcrumbs />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('should render custom breadcrumbs', () => {
    const items = [
      { label: 'Home', href: '/' },
      { label: 'Users', href: '/users' },
      { label: 'Profile', isActive: true }
    ]

    render(<AdminBreadcrumbs items={items} />)
    
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
  })
})

describe('Type Safety', () => {
  it('should have correct types for AdminUser', () => {
    const user: AdminUser = {
      id: 'test',
      name: 'Test User',
      email: 'test@example.com',
      roles: [],
      permissions: ['admin.read'],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    expect(user.id).toBe('test')
    expect(user.permissions).toContain('admin.read')
  })
}) 