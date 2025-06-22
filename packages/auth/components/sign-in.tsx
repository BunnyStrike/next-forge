"use client"
import { useState } from "react"
import { signIn } from "../client"

interface SignInButtonProps {
  children?: React.ReactNode
  mode?: "modal" | "redirect"
  redirectUrl?: string
}

export function SignInButton({ 
  children, 
  mode = "redirect",
  redirectUrl = "/dashboard" 
}: SignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn.social({ 
        provider: "google",
        redirectTo: redirectUrl 
      })
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
    >
      {isLoading ? "Signing in..." : (children || "Sign In")}
    </button>
  )
}

interface SignInFormProps {
  redirectUrl?: string
}

export function SignInForm({ redirectUrl = "/dashboard" }: SignInFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await signIn.email({
        email,
        password,
        redirectTo: redirectUrl
      })
    } catch (error) {
      setError("Failed to sign in. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setLoading(true)
    try {
      await signIn.social({ 
        provider, 
        redirectTo: redirectUrl 
      })
    } catch (error) {
      setError(`Failed to sign in with ${provider}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {error && (
        <div className="text-red-600 text-sm text-center">{error}</div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="space-y-2">
        <button
          onClick={() => handleSocialSignIn("google")}
          disabled={loading}
          className="w-full border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Continue with Google
        </button>
        <button
          onClick={() => handleSocialSignIn("github")}
          disabled={loading}
          className="w-full border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Continue with GitHub
        </button>
      </div>
    </div>
  )
}
