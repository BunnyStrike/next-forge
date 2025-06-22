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
