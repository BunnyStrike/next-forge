'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  X, 
  Check, 
  Info, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@repo/design-system/components/ui/button'
import { Badge } from '@repo/design-system/components/ui/badge'
import { ScrollArea } from '@repo/design-system/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu'
import { cn } from '@repo/design-system/lib/utils'
import { useAdmin } from '../hooks/use-admin'
import type { AdminNotification } from '../lib/types'

const getNotificationIcon = (type: AdminNotification['type']) => {
  switch (type) {
    case 'success':
      return CheckCircle
    case 'error':
      return XCircle
    case 'warning':
      return AlertTriangle
    default:
      return Info
  }
}

const getNotificationColor = (type: AdminNotification['type']) => {
  switch (type) {
    case 'success':
      return 'text-green-500'
    case 'error':
      return 'text-red-500'
    case 'warning':
      return 'text-yellow-500'
    default:
      return 'text-blue-500'
  }
}

interface AdminNotificationItemProps {
  notification: AdminNotification
  onMarkAsRead: (id: string) => void
}

const AdminNotificationItem = ({ 
  notification, 
  onMarkAsRead 
}: AdminNotificationItemProps) => {
  const Icon = getNotificationIcon(notification.type)
  const iconColor = getNotificationColor(notification.type)

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={cn(
        'flex items-start space-x-3 p-4 border-b border-border last:border-0',
        !notification.isRead && 'bg-muted/50'
      )}
    >
      <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', iconColor)} />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {notification.title}
            </p>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {notification.message}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
            </p>
          </div>
          
          {!notification.isRead && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkAsRead(notification.id)}
              className="h-6 w-6 p-0 ml-2"
            >
              <Check className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Actions */}
        {notification.actions && notification.actions.length > 0 && (
          <div className="flex items-center space-x-2 mt-3">
            {notification.actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant === 'primary' ? 'default' : action.variant || 'secondary'}
                size="sm"
                onClick={action.action}
                className="h-7 text-xs"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export const AdminNotifications = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    clearNotifications 
  } = useAdmin()

  const unreadCount = notifications.filter(n => !n.isRead).length
  const [isOpen, setIsOpen] = React.useState(false)

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id)
  }

  const handleMarkAllAsRead = () => {
    notifications
      .filter(n => !n.isRead)
      .forEach(n => markNotificationAsRead(n.id))
  }

  const handleClearAll = () => {
    clearNotifications()
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-80 p-0"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="h-7 text-xs"
              >
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="h-7 text-xs text-muted-foreground"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <ScrollArea className="h-80">
            <AnimatePresence>
              {notifications
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .map((notification) => (
                  <AdminNotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                  />
                ))}
            </AnimatePresence>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No notifications yet
            </p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 