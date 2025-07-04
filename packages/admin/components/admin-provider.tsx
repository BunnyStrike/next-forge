'use client'

import React, { useState, useCallback } from 'react'
import { AdminContext } from '../hooks/use-admin'
import { useAdminNotifications } from '../hooks/use-admin-notifications'
import type { 
  AdminContextType,
  AdminTab,
  AdminContent,
  AdminCollection,
  AdminUser,
  AdminPermission,
  AdminSystemHealth
} from '../lib/types'

interface AdminProviderProps {
  children: React.ReactNode
  defaultUser?: AdminUser | null
}

export const AdminProvider = ({ 
  children, 
  defaultUser = null 
}: AdminProviderProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')
  const [selectedContent, setSelectedContent] = useState<AdminContent | null>(null)
  const [selectedCollection, setSelectedCollection] = useState<AdminCollection | null>(null)
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(defaultUser)
  const [systemHealth, setSystemHealth] = useState<AdminSystemHealth | null>(null)

  const {
    notifications,
    addNotification,
    markAsRead,
    clearAll,
  } = useAdminNotifications()

  const openAdmin = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeAdmin = useCallback(() => {
    setIsOpen(false)
  }, [])

  const hasPermission = useCallback((permission: AdminPermission): boolean => {
    if (!currentUser) return false
    return currentUser.permissions.includes(permission)
  }, [currentUser])

  // Content Management
  const updateContent = useCallback(async (id: string, updates: Partial<AdminContent>) => {
    // Mock implementation - replace with actual API call
    console.log('Updating content:', id, updates)
    addNotification({
      type: 'success',
      title: 'Content Updated',
      message: 'Content has been successfully updated.',
    })
  }, [addNotification])

  const createCollectionItem = useCallback(async (collectionId: string, data: Record<string, any>) => {
    // Mock implementation - replace with actual API call
    console.log('Creating collection item:', collectionId, data)
    addNotification({
      type: 'success',
      title: 'Item Created',
      message: 'Collection item has been successfully created.',
    })
  }, [addNotification])

  const updateCollectionItem = useCallback(async (id: string, data: Record<string, any>) => {
    // Mock implementation - replace with actual API call
    console.log('Updating collection item:', id, data)
    addNotification({
      type: 'success',
      title: 'Item Updated',
      message: 'Collection item has been successfully updated.',
    })
  }, [addNotification])

  const deleteCollectionItem = useCallback(async (id: string) => {
    // Mock implementation - replace with actual API call
    console.log('Deleting collection item:', id)
    addNotification({
      type: 'success',
      title: 'Item Deleted',
      message: 'Collection item has been successfully deleted.',
    })
  }, [addNotification])

  // User Management
  const createUser = useCallback(async (user: Omit<AdminUser, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Mock implementation - replace with actual API call
    const newUser: AdminUser = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    console.log('Creating user:', newUser)
    addNotification({
      type: 'success',
      title: 'User Created',
      message: 'User has been successfully created.',
    })
    return newUser
  }, [addNotification])

  const updateUser = useCallback(async (id: string, updates: Partial<AdminUser>) => {
    // Mock implementation - replace with actual API call
    console.log('Updating user:', id, updates)
    addNotification({
      type: 'success',
      title: 'User Updated',
      message: 'User has been successfully updated.',
    })
  }, [addNotification])

  const deleteUser = useCallback(async (id: string) => {
    // Mock implementation - replace with actual API call
    console.log('Deleting user:', id)
    addNotification({
      type: 'success',
      title: 'User Deleted',
      message: 'User has been successfully deleted.',
    })
  }, [addNotification])

  // System
  const refreshSystemHealth = useCallback(async () => {
    try {
      // Mock implementation - replace with actual API call
      const health: AdminSystemHealth = {
        status: 'healthy',
        uptime: 99.9,
        services: [
          { name: 'Database', status: 'operational', responseTime: 45, lastChecked: new Date() },
          { name: 'API', status: 'operational', responseTime: 120, lastChecked: new Date() },
          { name: 'CDN', status: 'operational', responseTime: 30, lastChecked: new Date() },
        ],
        lastChecked: new Date(),
      }
      setSystemHealth(health)
    } catch (error) {
      console.error('Failed to refresh system health:', error)
    }
  }, [])

  const value: AdminContextType = {
    // State
    isOpen,
    activeTab,
    selectedContent,
    selectedCollection,
    currentUser,
    notifications,
    systemHealth,
    
    // Actions
    openAdmin,
    closeAdmin,
    setActiveTab,
    setSelectedContent,
    setSelectedCollection,
    
    // Content Management
    updateContent,
    createCollectionItem,
    updateCollectionItem,
    deleteCollectionItem,
    
    // User Management
    createUser,
    updateUser,
    deleteUser,
    
    // Notifications
    addNotification,
    markNotificationAsRead: markAsRead,
    clearNotifications: clearAll,
    
    // System
    refreshSystemHealth,
    hasPermission,
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}
