import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring, useTransform, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NumberTickerProps {
  value: number
  className?: string
  duration?: number
  delay?: number
  decimalPlaces?: number
}

export default function NumberTicker({
  value,
  className,
  duration = 2,
  delay = 0,
  decimalPlaces = 0,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    damping: 40,
    stiffness: 100,
    duration: duration * 1000,
  })
  const displayValue = useTransform(springValue, (current) =>
    current.toFixed(decimalPlaces)
  )
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(value)
      }, delay * 1000)
      return () => clearTimeout(timer)
    }
  }, [motionValue, isInView, delay, value])

  return (
    <motion.span ref={ref} className={cn('tabular-nums', className)}>
      {displayValue}
    </motion.span>
  )
}
