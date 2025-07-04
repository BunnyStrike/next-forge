'use client'

import React from 'react'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@repo/design-system/lib/utils'
import type { AdminBreadcrumb } from '../lib/types'

interface AdminBreadcrumbsProps {
  items?: AdminBreadcrumb[]
  className?: string
}

export const AdminBreadcrumbs = ({ 
  items = [], 
  className 
}: AdminBreadcrumbsProps) => {
  // Default to home if no items provided
  const breadcrumbs = items.length > 0 ? items : [
    { label: 'Dashboard', href: '/', isActive: true }
  ]

  return (
    <nav 
      className={cn('flex items-center space-x-1 text-sm', className)}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbs.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
            )}
            {item.href && !item.isActive ? (
              <a
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {index === 0 && breadcrumbs.length > 1 ? (
                  <Home className="h-4 w-4" />
                ) : (
                  item.label
                )}
              </a>
            ) : (
              <span
                className={cn(
                  item.isActive 
                    ? 'text-foreground font-medium' 
                    : 'text-muted-foreground'
                )}
              >
                {index === 0 && breadcrumbs.length > 1 ? (
                  <Home className="h-4 w-4" />
                ) : (
                  item.label
                )}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
} 