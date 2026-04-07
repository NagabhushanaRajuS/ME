type ComingSoonProps = {
  text?: string
  className?: string
}

export function ComingSoon({ text = "Coming Soon", className = "" }: ComingSoonProps) {
  return (
    <div className={`animated-border card-premium card-premium-pad text-center text-sm text-muted ${className}`}>
      {text}
    </div>
  )
}
