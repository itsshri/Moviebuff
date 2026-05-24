import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedGradientTextProps {
  children: ReactNode
  className?: string
}

export default function AnimatedGradientText({
  children,
  className,
}: AnimatedGradientTextProps) {
  return (
    <span
      className={cn(
        'inline-block bg-clip-text text-transparent',
        'bg-[length:300%_100%]',
        'animate-[gradient-shift_4s_ease-in-out_infinite]',
        className
      )}
      style={{
        backgroundImage:
          'linear-gradient(90deg, #7C3AED, #2563EB, #FF4757, #7C3AED, #2563EB)',
      }}
    >
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
      {children}
    </span>
  )
}
