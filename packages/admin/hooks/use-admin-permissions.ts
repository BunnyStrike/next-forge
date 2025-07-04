'use client'

import { useMemo } from 'react'
import { useAdmin } from './use-admin'
import type { AdminPermission } from '../lib/types'

export const useAdminPermissions = () => {
  const { currentUser, hasPermission } = useAdmin()

  const permissions = useMemo(() => {
    if (!currentUser) return []
    return currentUser.permissions
  }, [currentUser])

  const roles = useMemo(() => {
    if (!currentUser) return []
    return currentUser.roles
  }, [currentUser])

  const canRead = (resource: string) => {
    return hasPermission(`${resource}.read` as AdminPermission)
  }

  const canWrite = (resource: string) => {
    return hasPermission(`${resource}.write` as AdminPermission)
  }

  const canDelete = (resource: string) => {
    return hasPermission(`${resource}.delete` as AdminPermission)
  }

  const isAdmin = () => {
    return hasPermission('admin.read') && hasPermission('admin.write')
  }

  const isSuperAdmin = () => {
    return roles.some(role => role.name === 'super-admin' || role.name === 'admin')
  }

  const hasAnyPermission = (perms: AdminPermission[]) => {
    return perms.some(permission => hasPermission(permission))
  }

  const hasAllPermissions = (perms: AdminPermission[]) => {
    return perms.every(permission => hasPermission(permission))
  }

  return {
    permissions,
    roles,
    canRead,
    canWrite,
    canDelete,
    isAdmin,
    isSuperAdmin,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  }
} 