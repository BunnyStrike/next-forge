interface ToolbarProps {
  className?: string
}

export const Toolbar = ({ className }: ToolbarProps) => (
  <div className={className}>
    <div className="fixed bottom-4 right-4 rounded-lg bg-background border shadow-lg p-4">
      <p className="text-sm text-muted-foreground">
        Custom CMS Toolbar - implement your own CMS toolbar here
      </p>
    </div>
  </div>
)
