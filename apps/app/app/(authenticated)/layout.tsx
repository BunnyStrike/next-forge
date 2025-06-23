import { auth } from '@repo/auth/server'
import { DesignSystemProvider } from '@repo/design-system'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import type { ReactNode } from 'react'
import { GlobalSidebar } from './components/sidebar'
import { PostHogIdentifier } from './components/posthog-identifier'

interface AuthenticatedLayoutProperties {
  children: ReactNode
}

export default async function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProperties) {
  const headersList = await headers()
  const session = await auth.api.getSession({
    headers: headersList,
  })

  if (!session?.user) {
    redirect('/sign-in')
  }

  return (
    <DesignSystemProvider>
      <GlobalSidebar>
        {children}
      </GlobalSidebar>
      <PostHogIdentifier />
    </DesignSystemProvider>
  )
}
