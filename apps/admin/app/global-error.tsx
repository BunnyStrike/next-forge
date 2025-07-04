'use client'

import { Button } from '@repo/design-system/components/ui/button'
import { fonts } from '@repo/design-system/lib/fonts'
import { captureException } from '@sentry/nextjs'
import type NextError from 'next/error'
import { useEffect } from 'react'

type GlobalErrorProperties = {
  readonly error: NextError & { digest?: string }
  readonly reset: () => void
}

const GlobalError = ({ error, reset }: GlobalErrorProperties) => {
  useEffect(() => {
    captureException(error)
  }, [error])

  return (
    <html lang='en' className={fonts}>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong in the admin panel
            </h1>
            <p className="text-gray-600 mb-6">
              An error occurred while loading the admin interface. Please try again.
            </p>
            <Button onClick={() => reset()}>
              Try again
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}

export default GlobalError 