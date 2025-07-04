'use client'

import { createContext, useContext } from 'react'
import type { AdminContextType } from '../lib/types'

export const AdminContext = createContext<AdminContextType | null>(null)

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext)
  
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  
  return context
}
