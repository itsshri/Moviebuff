import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

type Listener = () => void

let toasts: Toast[] = []
const listeners: Set<Listener> = new Set()

function emitChange() {
  listeners.forEach(listener => listener())
}

export function addToast(message: string, type: Toast['type'] = 'info') {
  const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 6)
  toasts = [...toasts, { id, message, type }]
  emitChange()

  // Auto-remove after 3.5 seconds
  setTimeout(() => {
    removeToast(id)
  }, 3500)
}

function removeToast(id: string) {
  toasts = toasts.filter(t => t.id !== id)
  emitChange()
}

function useToastStore() {
  const [, setTick] = useState(0)

  useEffect(() => {
    const listener = () => setTick(t => t + 1)
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  }, [])

  return toasts
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const colorMap = {
  success: 'border-accent-green/30 bg-accent-green/10',
  error: 'border-accent-coral/30 bg-accent-coral/10',
  warning: 'border-accent-amber/30 bg-accent-amber/10',
  info: 'border-primary/30 bg-primary/10',
}

const iconColorMap = {
  success: 'text-accent-green',
  error: 'text-accent-coral',
  warning: 'text-accent-amber',
  info: 'text-primary',
}

export function ToastContainer() {
  const currentToasts = useToastStore()

  return (
    <div className="fixed bottom-24 md:bottom-6 right-4 z-[80] flex flex-col gap-2 max-w-sm">
      <AnimatePresence mode="popLayout">
        {currentToasts.map(toast => {
          const Icon = iconMap[toast.type]
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg',
                colorMap[toast.type]
              )}
            >
              <Icon className={cn('w-5 h-5 shrink-0', iconColorMap[toast.type])} />
              <p className="text-sm text-white flex-1">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-0.5 hover:bg-white/10 rounded transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5 text-zinc-400" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
