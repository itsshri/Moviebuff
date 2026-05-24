import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Ticket, Calendar, MapPin, Clock, X, AlertTriangle, ChevronRight } from 'lucide-react'
import { cn, formatCurrency, formatDate, formatTime } from '@/lib/utils'
import { mockBookings } from '@/data/mockData'
import { useUserBookingsStore } from '@/store'
import type { Booking } from '@/types'

type Tab = 'upcoming' | 'past' | 'cancelled'

const statusConfig = {
  confirmed: { label: 'Confirmed', color: 'text-accent-green bg-accent-green/10 border-accent-green/20' },
  cancelled: { label: 'Cancelled', color: 'text-accent-coral bg-accent-coral/10 border-accent-coral/20' },
  expired: { label: 'Expired', color: 'text-zinc-500 bg-white/5 border-white/10' },
}

function TicketCard({ booking, onCancel }: { booking: Booking; onCancel?: () => void }) {
  const status = statusConfig[booking.status]
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="glass-card-hover overflow-hidden"
    >
      <div className="p-4 flex gap-4">
        <img
          src={booking.movie.posterUrl}
          alt={booking.movie.title}
          className="w-16 h-24 object-cover rounded-xl shrink-0 shadow-lg"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold truncate">{booking.movie.title}</h3>
            <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium border shrink-0', status.color)}>
              {status.label}
            </span>
          </div>
          <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 shrink-0" />
            {booking.cinema.name}
          </p>
          <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
            <Calendar className="w-3 h-3 shrink-0" />
            {formatDate(booking.show.date)}
            <Clock className="w-3 h-3 ml-1 shrink-0" />
            {formatTime(booking.show.time)} • {booking.show.format}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {booking.seats.map(s => (
              <span key={s.id} className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-[10px] font-mono text-primary">
                {s.row}{s.number}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="font-bold text-sm">{formatCurrency(booking.total)}</span>
            <div className="flex items-center gap-2">
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="px-3 py-1 rounded-lg bg-accent-coral/10 border border-accent-coral/20 text-accent-coral text-xs font-medium hover:bg-accent-coral/20 transition-colors"
                >
                  Cancel
                </button>
              )}
              <Link
                to={`/booking/${booking.id}`}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium hover:border-primary/30 transition-colors"
              >
                View <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function EmptyState({ tab }: { tab: Tab }) {
  return (
    <div className="text-center py-20">
      <Ticket className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
      <p className="text-zinc-400 font-medium">
        {tab === 'upcoming' ? 'No upcoming bookings' : tab === 'past' ? 'No past bookings' : 'No cancelled bookings'}
      </p>
      {tab === 'upcoming' && (
        <Link to="/movies" className="inline-flex items-center gap-1 mt-3 text-primary text-sm hover:underline">
          Browse Movies <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  )
}

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('upcoming')
  const [cancelId, setCancelId] = useState<string | null>(null)
  const { bookings, loadBookings, cancelBooking } = useUserBookingsStore()

  // Initialize with mock bookings on first load
  useEffect(() => {
    if (bookings.length === 0) {
      loadBookings(mockBookings)
    }
  }, [])

  const now = new Date()
  const categorized = {
    upcoming: bookings.filter(b => b.status === 'confirmed' && new Date(b.show.date) >= now),
    past: bookings.filter(b => b.status === 'confirmed' && new Date(b.show.date) < now),
    cancelled: bookings.filter(b => b.status === 'cancelled'),
  }

  const handleConfirmCancel = () => {
    if (!cancelId) return
    cancelBooking(cancelId)
    setCancelId(null)
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'upcoming', label: 'Upcoming', count: categorized.upcoming.length },
    { key: 'past', label: 'Past', count: categorized.past.length },
    { key: 'cancelled', label: 'Cancelled', count: categorized.cancelled.length },
  ]

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-black mb-8">My Bookings</h1>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-surface rounded-2xl border border-white/10 mb-6">
          {tabs.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all',
                activeTab === key
                  ? 'bg-primary text-white shadow-glow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              )}
            >
              {label}
              {count > 0 && (
                <span className={cn(
                  'w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center',
                  activeTab === key ? 'bg-white/20 text-white' : 'bg-white/10 text-zinc-400'
                )}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {categorized[activeTab].length === 0 ? (
              <EmptyState tab={activeTab} />
            ) : (
              categorized[activeTab].map(booking => (
                <TicketCard
                  key={booking.id}
                  booking={booking}
                  onCancel={activeTab === 'upcoming' ? () => setCancelId(booking.id) : undefined}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AnimatePresence>
        {cancelId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setCancelId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm bg-surface border border-white/10 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent-coral/10 border border-accent-coral/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-accent-coral" />
                </div>
                <h3 className="font-semibold text-lg">Cancel Booking?</h3>
              </div>
              <p className="text-zinc-400 text-sm mb-6">
                A refund will be processed to your original payment method within 5-7 business days.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setCancelId(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="flex-1 py-2.5 rounded-xl bg-accent-coral/10 border border-accent-coral/20 text-accent-coral text-sm font-medium hover:bg-accent-coral/20 transition-colors"
                >
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
