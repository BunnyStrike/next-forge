import { AdminSidebar } from '@repo/admin/components/admin-sidebar'
import type { ReactNode } from 'react'

interface AuthenticatedLayoutProperties {
  children: ReactNode
}

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProperties) {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
} 