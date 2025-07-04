'use client'

import { useState, useEffect, useCallback } from 'react'
import type { AdminNotification } from '../lib/types'

export const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([])

  const addNotification = useCallback((
    notification: Omit<AdminNotification, 'id' | 'createdAt' | 'isRead'>
  ) => {
    const newNotification: AdminNotification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      isRead: false,
      createdAt: new Date(),
    }

    setNotifications(prev => [newNotification, ...prev])

    // Auto-remove success notifications after 5 seconds
    if (notification.type === 'success') {
      setTimeout(() => {
        removeNotification(newNotification.id)
      }, 5000)
    }
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const clearRead = useCallback(() => {
    setNotifications(prev => prev.filter(n => !n.isRead))
  }, [])

  // Convenience methods for different notification types
  const notifySuccess = useCallback((title: string, message: string) => {
    addNotification({ type: 'success', title, message })
  }, [addNotification])

  const notifyError = useCallback((title: string, message: string) => {
    addNotification({ type: 'error', title, message })
  }, [addNotification])

  const notifyWarning = useCallback((title: string, message: string) => {
    addNotification({ type: 'warning', title, message })
  }, [addNotification])

  const notifyInfo = useCallback((title: string, message: string) => {
    addNotification({ type: 'info', title, message })
  }, [addNotification])

  const unreadCount = notifications.filter(n => !n.isRead).length
  const totalCount = notifications.length

  return {
    notifications,
    unreadCount,
    totalCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    clearRead,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
  }
} 