type ComingSoonProps = {
  text?: string
  className?: string
}

export function ComingSoon({ text = "Coming Soon", className = "" }: ComingSoonProps) {
  return (
    <div className={`rounded-2xl border border-dashed border-line bg-surface/60 p-6 text-center text-sm text-muted ${className}`}>
      {text}
    </div>
  )
}
