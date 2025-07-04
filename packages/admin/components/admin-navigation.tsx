'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
  Database,
  Globe,
  MessageSquare,
  Shield,
  Bell,
  Search,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@repo/design-system/lib/utils'
import { Button } from '@repo/design-system/components/ui/button'
import { Badge } from '@repo/design-system/components/ui/badge'
import { Input } from '@repo/design-system/components/ui/input'
import { useAdmin } from '../hooks/use-admin'
import type { AdminNavItem } from '../lib/types'

const defaultNavItems: AdminNavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
    tab: 'dashboard',
    permissions: ['admin.read'],
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    href: '/users',
    tab: 'users',
    permissions: ['users.read'],
    badge: '2.5K',
  },
  {
    id: 'content',
    label: 'Content',
    icon: FileText,
    tab: 'content',
    permissions: ['content.read'],
    children: [
      {
        id: 'content-articles',
        label: 'Articles',
        href: '/content/articles',
        permissions: ['content.read'],
      },
      {
        id: 'content-pages',
        label: 'Pages',
        href: '/content/pages',
        permissions: ['content.read'],
      },
      {
        id: 'content-media',
        label: 'Media',
        href: '/content/media',
        permissions: ['content.read'],
      },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    href: '/analytics',
    tab: 'analytics',
    permissions: ['analytics.read'],
  },
  {
    id: 'community',
    label: 'Community',
    icon: MessageSquare,
    href: '/community',
    permissions: ['content.read'],
    children: [
      {
        id: 'community-forums',
        label: 'Forums',
        href: '/community/forums',
        permissions: ['content.read'],
      },
      {
        id: 'community-moderation',
        label: 'Moderation',
        href: '/community/moderation',
        permissions: ['content.write'],
        badge: '3',
      },
    ],
  },
  {
    id: 'system',
    label: 'System',
    icon: Database,
    tab: 'system',
    permissions: ['admin.read'],
    children: [
      {
        id: 'system-webhooks',
        label: 'Webhooks',
        href: '/system/webhooks',
        icon: Globe,
        permissions: ['webhooks.read'],
      },
      {
        id: 'system-security',
        label: 'Security',
        href: '/system/security',
        icon: Shield,
        permissions: ['admin.read'],
      },
      {
        id: 'system-settings',
        label: 'Settings',
        href: '/system/settings',
        icon: Settings,
        permissions: ['settings.read'],
      },
    ],
  },
]

interface AdminNavigationProps {
  navItems?: AdminNavItem[]
  className?: string
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
}

export const AdminNavigation = ({ 
  navItems = defaultNavItems, 
  className,
  collapsed = false,
  onCollapse,
}: AdminNavigationProps) => {
  const pathname = usePathname()
  const { hasPermission, notifications } = useAdmin()
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = React.useState('')

  const unreadNotifications = notifications.filter(n => !n.isRead).length

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const filteredNavItems = React.useMemo(() => {
    if (!searchQuery) return navItems
    
    return navItems.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.children?.some(child => 
        child.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  }, [navItems, searchQuery])

  const isItemActive = (item: AdminNavItem): boolean => {
    if (item.href && pathname === item.href) return true
    if (item.children?.some(child => child.href === pathname)) return true
    return false
  }

  const hasItemPermission = (item: AdminNavItem): boolean => {
    if (!item.permissions?.length) return true
    return item.permissions.some(permission => hasPermission(permission))
  }

  const renderNavItem = (item: AdminNavItem, level = 0) => {
    if (!hasItemPermission(item)) return null

    const isActive = isItemActive(item)
    const isExpanded = expandedItems.has(item.id)
    const hasChildren = item.children && item.children.length > 0
    const Icon = item.icon

    return (
      <div key={item.id} className="w-full">
        <div
          className={cn(
            'flex items-center w-full text-left transition-colors duration-200',
            level === 0 ? 'mb-1' : 'mb-0.5',
            level > 0 && 'ml-4'
          )}
        >
          {item.href ? (
            <Link
              href={item.href}
              className={cn(
                'flex items-center flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                collapsed && level === 0 && 'justify-center px-2'
              )}
            >
              {Icon && (
                <Icon 
                  className={cn(
                    'h-4 w-4 flex-shrink-0',
                    !collapsed && 'mr-3'
                  )} 
                />
              )}
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          ) : (
            <Button
              variant="ghost"
              onClick={() => hasChildren && toggleExpanded(item.id)}
              className={cn(
                'flex items-center flex-1 px-3 py-2 h-auto text-sm font-medium justify-start',
                isActive && 'bg-accent',
                collapsed && level === 0 && 'justify-center px-2'
              )}
            >
              {Icon && (
                <Icon 
                  className={cn(
                    'h-4 w-4 flex-shrink-0',
                    !collapsed && 'mr-3'
                  )} 
                />
              )}
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                  {hasChildren && (
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </motion.div>
                  )}
                </>
              )}
            </Button>
          )}
        </div>

        {/* Children */}
        {hasChildren && !collapsed && (
          <motion.div
            initial={false}
            animate={{
              height: isExpanded ? 'auto' : 0,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ml-4 border-l border-border pl-4 space-y-1">
              {item.children?.map(child => renderNavItem(child, level + 1))}
            </div>
          </motion.div>
        )}
      </div>
    )
  }

  return (
    <nav className={cn('flex flex-col space-y-2', className)}>
      {/* Search */}
      {!collapsed && (
        <div className="px-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search navigation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>
      )}

      {/* Notifications */}
      {!collapsed && unreadNotifications > 0 && (
        <div className="px-3 mb-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            <Bell className="h-4 w-4 mr-2" />
            {unreadNotifications} new notifications
            <Badge variant="destructive" className="ml-auto">
              {unreadNotifications}
            </Badge>
          </Button>
        </div>
      )}

      {/* Navigation Items */}
      <div className="px-3 space-y-1">
        {filteredNavItems.map(item => renderNavItem(item))}
      </div>
    </nav>
  )
} 