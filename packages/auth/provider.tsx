"use client"
import { createContext, useContext, type ComponentProps, type ReactNode } from 'react'
import { useSession } from './client'

interface AuthContextValue {
  user: any | null
  isLoaded: boolean
  isSignedIn: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProperties {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProperties) {
  const { data: session, isPending } = useSession()
  
  const value: AuthContextValue = {
    user: session?.user || null,
    isLoaded: !isPending,
    isSignedIn: !!session?.user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
