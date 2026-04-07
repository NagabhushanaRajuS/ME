type BrandLoopIconProps = {
  className?: string
  title?: string
}

export function BrandLoopIcon({ className = "", title = "Brand icon" }: BrandLoopIconProps) {
  return (
    <span
      className={`relative inline-flex h-9 w-9 overflow-hidden rounded-full border border-line bg-surface shadow-card ${className}`}
      aria-label={title}
    >
      <video
        className="h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        src="/api/brand/icon"
      />
    </span>
  )
}
