'use client'

import React from 'react'
import { Settings } from 'lucide-react'
import { Button } from '@repo/design-system/components/ui/button'
import { useAdmin } from '../hooks/use-admin'

type AdminTriggerProps = {
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export const AdminTrigger = ({
  className,
  variant = 'outline',
  size = 'icon',
}: AdminTriggerProps) => {
  const { openAdmin } = useAdmin()

  return (
    <Button
      variant={variant}
      size={size}
      onClick={openAdmin}
      className={className}
      title='Open Admin Panel'
    >
      <Settings className='w-4 h-4' />
      {size !== 'icon' && <span className='ml-2'>Admin</span>}
    </Button>
  )
}
