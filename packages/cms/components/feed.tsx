import type { ReactNode } from 'react'

interface FeedProps {
  children: ReactNode
  className?: string
}

export const Feed = ({ children, className }: FeedProps) => (
  <div className={className}>
    {children}
    <div className="mt-8 text-center text-sm text-muted-foreground">
      Custom CMS Feed - implement your own feed logic here
    </div>
  </div>
)
