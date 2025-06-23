import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000",
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient

// Compatibility hooks for easier migration from Clerk
export function useUser() {
  const { data: session, isPending } = useSession()
  return {
    user: session?.user || null,
    isLoaded: !isPending,
    isSignedIn: !!session?.user,
  }
}

export function useClerk() {
  return {
    signOut: () => signOut(),
    user: useUser().user,
  }
}

// Placeholder components for migration from Clerk
export function OrganizationSwitcher() {
  return (
    <div className="text-sm text-muted-foreground">
      Organization switcher - implement with Better Auth
    </div>
  )
}

export function UserButton() {
  const { user } = useUser()
  
  if (!user) return null
  
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
      </div>
      <span>{user.name || user.email}</span>
    </div>
  )
}
