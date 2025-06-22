import type { ReactNode } from 'react'

interface TableOfContentsProps {
  data: {
    title: string
    id: string
    level: number
  }[]
  className?: string
}

export const TableOfContents = ({ data, className }: TableOfContentsProps) => (
  <div className={className}>
    <nav>
      <ol className='flex list-none flex-col gap-2 text-sm'>
        {data.map((item) => (
          <li key={item.id} className='pl-3' style={{ paddingLeft: `${item.level * 12}px` }}>
            <a
              className='line-clamp-3 flex rounded-sm text-foreground text-sm underline decoration-foreground/0 transition-colors hover:decoration-foreground/50'
              href={`#${item.id}`}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  </div>
)
