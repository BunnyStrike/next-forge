import type { ReactNode } from 'react'

interface BodyProps {
  children: ReactNode
}

export const Body = ({ children }: BodyProps) => (
  <div className="prose prose-neutral dark:prose-invert max-w-none">
    {children}
  </div>
)
