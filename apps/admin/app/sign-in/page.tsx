'use client'

import { SignInForm } from '@repo/auth/components/sign-in'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/design-system/components/ui/card'

export default function AdminSignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Sign In
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your admin dashboard
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sign in to Admin Panel</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignInForm redirectTo="/dashboard" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 