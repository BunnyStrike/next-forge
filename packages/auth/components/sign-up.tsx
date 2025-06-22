"use client"
import { useState } from "react"
import { signUp } from "../client"

interface SignUpButtonProps {
  children?: React.ReactNode
  mode?: "modal" | "redirect"
  redirectUrl?: string
}

export function SignUpButton({ 
  children, 
  mode = "redirect",
  redirectUrl = "/dashboard" 
}: SignUpButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = async () => {
    setIsLoading(true)
    try {
      await signUp.social({ 
        provider: "google",
        redirectTo: redirectUrl 
      })
    } catch (error) {
      console.error("Sign up error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSignUp}
      disabled={isLoading}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
    >
      {isLoading ? "Signing up..." : (children || "Sign Up")}
    </button>
  )
}

interface SignUpFormProps {
  redirectUrl?: string
}

export function SignUpForm({ redirectUrl = "/dashboard" }: SignUpFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await signUp.email({
        email,
        password,
        name,
        redirectTo: redirectUrl
      })
    } catch (error) {
      setError("Failed to sign up. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSocialSignUp = async (provider: "google" | "github") => {
    setLoading(true)
    try {
      await signUp.social({ 
        provider, 
        redirectTo: redirectUrl 
      })
    } catch (error) {
      setError(`Failed to sign up with ${provider}`)
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
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
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
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <div className="space-y-2">
        <button
          onClick={() => handleSocialSignUp("google")}
          disabled={loading}
          className="w-full border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Continue with Google
        </button>
        <button
          onClick={() => handleSocialSignUp("github")}
          disabled={loading}
          className="w-full border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Continue with GitHub
        </button>
      </div>
    </div>
  )
}
