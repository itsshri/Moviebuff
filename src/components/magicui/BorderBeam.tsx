import { cn } from '@/lib/utils'

interface BorderBeamProps {
  className?: string
  size?: number
  duration?: number
  delay?: number
  colorFrom?: string
  colorTo?: string
  borderWidth?: number
}

export default function BorderBeam({
  className,
  size = 200,
  duration = 4,
  delay = 0,
  colorFrom = '#7C3AED',
  colorTo = '#2563EB',
  borderWidth = 1.5,
}: BorderBeamProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit]',
        className
      )}
      style={{
        overflow: 'hidden',
        WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        padding: borderWidth,
      }}
    >
      <div
        className="absolute animate-border-beam"
        style={{
          width: size,
          height: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          background: `linear-gradient(to left, ${colorFrom}, ${colorTo})`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          borderRadius: '50%',
          filter: `blur(4px)`,
          opacity: 0.85,
        }}
      />
    </div>
  )
}
