import type { ReactNode } from 'react'

interface CodeBlockProps {
  children: ReactNode
  language?: string
  filename?: string
}

export const CodeBlock = ({ children, language, filename }: CodeBlockProps) => (
  <div className="rounded-lg border bg-muted p-4">
    {filename && (
      <div className="mb-2 text-sm text-muted-foreground">{filename}</div>
    )}
    <pre className="overflow-x-auto">
      <code className={language ? `language-${language}` : ''}>
        {children}
      </code>
    </pre>
  </div>
)
