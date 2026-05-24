import { useState, useEffect, useCallback, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  color: string
  delay: number
  duration: number
}

interface SparklesTextProps {
  children: ReactNode
  className?: string
  sparklesCount?: number
  colors?: { first: string; second: string }
}

const DEFAULT_COLORS = { first: '#7C3AED', second: '#2563EB' }

function SparkleInstance({ sparkle }: { sparkle: Sparkle }) {
  return (
    <motion.span
      key={sparkle.id}
      className="pointer-events-none absolute inline-block"
      style={{
        left: `${sparkle.x}%`,
        top: `${sparkle.y}%`,
        zIndex: 20,
      }}
      initial={{ scale: 0, opacity: 0, rotate: 0 }}
      animate={{
        scale: [0, 1, 0],
        opacity: [0, 1, 0],
        rotate: [0, 180],
      }}
      transition={{
        duration: sparkle.duration,
        delay: sparkle.delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2 + 1,
        ease: 'easeInOut',
      }}
    >
      <svg
        width={sparkle.size}
        height={sparkle.size}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41L12 0Z"
          fill={sparkle.color}
        />
      </svg>
    </motion.span>
  )
}

export default function SparklesText({
  children,
  className,
  sparklesCount = 10,
  colors = DEFAULT_COLORS,
}: SparklesTextProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  const generateSparkle = useCallback(
    (id: number): Sparkle => ({
      id,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 12 + 8,
      color: Math.random() > 0.5 ? colors.first : colors.second,
      delay: Math.random() * 3,
      duration: Math.random() * 1.5 + 1,
    }),
    [colors.first, colors.second]
  )

  useEffect(() => {
    const initial = Array.from({ length: sparklesCount }, (_, i) =>
      generateSparkle(i)
    )
    setSparkles(initial)

    const interval = setInterval(() => {
      setSparkles((prev) =>
        prev.map((s) => ({
          ...s,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: 0,
        }))
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [sparklesCount, generateSparkle])

  return (
    <span className={cn('relative inline-block', className)}>
      <span className="relative z-10">{children}</span>
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <SparkleInstance key={sparkle.id} sparkle={sparkle} />
        ))}
      </AnimatePresence>
    </span>
  )
}
