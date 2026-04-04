export function GeometricAvatar() {
  return (
    <div className="relative mx-auto h-64 w-64 [perspective:1000px]">
      <div className="absolute inset-0 animate-float-slow [transform-style:preserve-3d]">
        <div className="absolute left-1/2 top-5 h-14 w-14 -translate-x-1/2 rounded-full border border-accent/70" />
        <div className="absolute left-1/2 top-20 h-24 w-20 -translate-x-1/2 border border-accent/60 [clip-path:polygon(50%_0%,100%_35%,82%_100%,18%_100%,0%_35%)]" />
        <div className="absolute left-[30%] top-[8.5rem] h-16 w-[2px] bg-accent/70" />
        <div className="absolute right-[30%] top-[8.5rem] h-16 w-[2px] bg-accent/70" />
        <div className="absolute left-[38%] top-[12.5rem] h-20 w-[2px] rotate-[12deg] bg-accent/70" />
        <div className="absolute right-[38%] top-[12.5rem] h-20 -rotate-[12deg] bg-accent/70" />
        <div className="absolute left-1/2 top-40 h-20 w-[2px] -translate-x-1/2 bg-accent/70" />
        <div className="absolute left-[44%] top-48 h-14 w-[2px] rotate-[10deg] bg-accent/70" />
        <div className="absolute right-[44%] top-48 h-14 w-[2px] -rotate-[10deg] bg-accent/70" />
      </div>
      <div className="absolute inset-0 -z-10 rounded-full bg-accent/10 blur-3xl" />
    </div>
  )
}
