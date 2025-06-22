export { auth } from "./server"
export { 
  authClient, 
  signIn, 
  signUp, 
  signOut, 
  useSession, 
  getSession, 
  useUser, 
  useClerk 
} from "./client"

export { SignInButton, SignInForm } from "./components/sign-in"
export { SignUpButton, SignUpForm } from "./components/sign-up"

// Server-side utilities
export async function getCurrentUser() {
  try {
    const { auth } = await import("./server")
    const { headers } = await import("next/headers")
    
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    return session?.user || null
  } catch (error) {
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
} 