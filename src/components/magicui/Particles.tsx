import { useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface ParticlesProps {
  className?: string
  quantity?: number
  color?: string
  stationary?: boolean
}

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  drift: number
}

export default function Particles({
  className,
  quantity = 50,
  color = '#7C3AED',
  stationary = false,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0 })

  const hexToRgb = useCallback((hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 124, g: 58, b: 237 }
  }, [])

  const createParticle = useCallback(
    (width: number, height: number): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.1,
      drift: Math.random() * Math.PI * 2,
    }),
    []
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (!rect) return
      canvas.width = rect.width
      canvas.height = rect.height
    }

    resizeCanvas()

    particlesRef.current = Array.from({ length: quantity }, () =>
      createParticle(canvas.width, canvas.height)
    )

    const rgb = hexToRgb(color)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    canvas.addEventListener('mousemove', handleMouseMove)

    let time = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.005

      particlesRef.current.forEach((particle) => {
        if (!stationary) {
          particle.x += particle.speedX + Math.sin(time + particle.drift) * 0.2
          particle.y += particle.speedY + Math.cos(time + particle.drift) * 0.15

          if (particle.x < 0) particle.x = canvas.width
          if (particle.x > canvas.width) particle.x = 0
          if (particle.y < 0) particle.y = canvas.height
          if (particle.y > canvas.height) particle.y = 0
        }

        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const interactionRadius = 120
        let currentOpacity = particle.opacity

        if (dist < interactionRadius) {
          currentOpacity = particle.opacity + (1 - dist / interactionRadius) * 0.4
        }

        const pulseOpacity = currentOpacity + Math.sin(time * 2 + particle.drift) * 0.08

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.min(pulseOpacity, 1)})`
        ctx.fill()

        if (particle.size > 1) {
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${pulseOpacity * 0.08})`
          ctx.fill()
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    const resizeObserver = new ResizeObserver(resizeCanvas)
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement)
    }

    return () => {
      cancelAnimationFrame(animationRef.current)
      canvas.removeEventListener('mousemove', handleMouseMove)
      resizeObserver.disconnect()
    }
  }, [quantity, color, stationary, createParticle, hexToRgb])

  return (
    <canvas
      ref={canvasRef}
      className={cn('pointer-events-auto absolute inset-0 h-full w-full', className)}
    />
  )
}
