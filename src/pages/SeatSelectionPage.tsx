import { useState, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Armchair,
  Sparkles,
  Clock,
  MapPin,
  Film,
  ChevronRight,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency, formatTime, formatDate } from '@/lib/utils'
import { generateSeatLayout, shows, movies, cinemas } from '@/data/mockData'
import { useBookingStore } from '@/store'
import { addToast as toast } from '@/components/common/Toast'
import type { Seat, SeatCategory, SeatSection } from '@/types'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Constants
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

const MAX_SEATS = 10

const CATEGORY_CONFIG: Record<SeatCategory, { emoji: string; color: string; label: string }> = {
  RECLINER: { emoji: '🛋️', color: 'text-accent-amber', label: 'Recliner' },
  PREMIUM: { emoji: '⭐', color: 'text-primary-light', label: 'Premium' },
  EXECUTIVE: { emoji: '💎', color: 'text-accent-blue', label: 'Executive' },
  NORMAL: { emoji: '🎬', color: 'text-zinc-400', label: 'Normal' },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Seat Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SeatButtonProps {
  seat: Seat
  isSelected: boolean
  onToggle: (seat: Seat) => void
}

function SeatButton({ seat, isSelected, onToggle }: SeatButtonProps) {
  const isOccupied = seat.status === 'occupied'

  return (
    <motion.button
      whileHover={!isOccupied ? { scale: 1.15 } : undefined}
      whileTap={!isOccupied ? { scale: 0.95 } : undefined}
      onClick={() => !isOccupied && onToggle(seat)}
      disabled={isOccupied}
      title={`${seat.row}${seat.number} - ${formatCurrency(seat.price)}`}
      className={cn(
        'w-7 h-7 md:w-8 md:h-8 rounded-md text-[9px] md:text-[10px] font-medium transition-all duration-200 relative',
        isOccupied && 'seat-occupied',
        !isOccupied && !isSelected && 'seat-available',
        isSelected && 'seat-selected'
      )}
    >
      {seat.number}
    </motion.button>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Section Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SectionProps {
  section: SeatSection
  selectedIds: Set<string>
  onToggleSeat: (seat: Seat) => void
}

function SeatSectionBlock({ section, selectedIds, onToggleSeat }: SectionProps) {
  const config = CATEGORY_CONFIG[section.category]
  const availableCount = section.rows.reduce(
    (sum, row) => sum + row.seats.filter((s) => s.status === 'available').length,
    0
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6"
    >
      {/* Category label */}
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{config.emoji}</span>
          <span className={cn('text-sm font-semibold uppercase tracking-wider', config.color)}>
            {config.label}
          </span>
          <span className="text-xs text-zinc-600">({availableCount} available)</span>
        </div>
        <span className="text-sm font-medium text-zinc-300">{formatCurrency(section.price)}</span>
      </div>

      {/* Rows */}
      <div className="space-y-1.5">
        {section.rows.map((row) => (
          <div key={row.label} className="flex items-center gap-2">
            {/* Row label */}
            <span className="w-6 text-center text-xs font-mono text-zinc-500 shrink-0">
              {row.label}
            </span>

            {/* Seats */}
            <div className="flex-1 flex justify-center gap-1 md:gap-1.5 flex-wrap">
              {row.seats.map((seat, idx) => (
                <span key={seat.id} className="contents">
                  {/* Aisle gap after 1/3 and 2/3 of seats */}
                  {idx === Math.floor(row.seats.length / 3) && (
                    <span className="w-3 md:w-5 shrink-0" />
                  )}
                  {idx === Math.floor((row.seats.length * 2) / 3) && (
                    <span className="w-3 md:w-5 shrink-0" />
                  )}
                  <SeatButton
                    seat={seat}
                    isSelected={selectedIds.has(seat.id)}
                    onToggle={onToggleSeat}
                  />
                </span>
              ))}
            </div>

            {/* Row label (right) */}
            <span className="w-6 text-center text-xs font-mono text-zinc-500 shrink-0">
              {row.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main Page
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function SeatSelectionPage() {
  const { showId } = useParams<{ showId: string }>()
  const navigate = useNavigate()
  const {
    draft,
    addSeat,
    removeSeat,
    clearSeats,
  } = useBookingStore()

  // Resolve show, movie, cinema — fallback to mockData if store is empty
  const show = draft.show ?? shows.find((s) => s.id === showId) ?? null
  const movie = draft.movie ?? (show ? movies.find((m) => m.id === show.movieId) : null) ?? null
  const cinema = draft.cinema ?? (show ? cinemas.find((c) => c.id === show.cinemaId) : null) ?? null

  // Generate seat layout (stable across renders via showId)
  const [seatLayout] = useState(() => generateSeatLayout(showId ?? ''))

  // Selected seats
  const selectedSeats = draft.selectedSeats
  const selectedIds = useMemo(() => new Set(selectedSeats.map((s) => s.id)), [selectedSeats])

  // Best-available seat count chooser
  const [bestCount, setBestCount] = useState(2)

  const subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0)

  // ── Toggle Seat ──
  const handleToggleSeat = useCallback(
    (seat: Seat) => {
      if (selectedIds.has(seat.id)) {
        removeSeat(seat.id)
      } else {
        if (selectedSeats.length >= MAX_SEATS) {
          toast(`Maximum ${MAX_SEATS} seats allowed`, 'warning')
          return
        }
        addSeat({ ...seat, status: 'selected' })
      }
    },
    [selectedIds, selectedSeats.length, addSeat, removeSeat]
  )

  // ── Best Available ──
  const handleBestAvailable = useCallback(() => {
    clearSeats()
    const available: Seat[] = []
    // Prefer middle rows, center seats
    for (const section of seatLayout.sections) {
      const midRowIdx = Math.floor(section.rows.length / 2)
      const sortedRows = [...section.rows].sort(
        (a, b) =>
          Math.abs(section.rows.indexOf(a) - midRowIdx) -
          Math.abs(section.rows.indexOf(b) - midRowIdx)
      )
      for (const row of sortedRows) {
        const midSeatIdx = Math.floor(row.seats.length / 2)
        const sortedSeats = [...row.seats]
          .filter((s) => s.status === 'available')
          .sort(
            (a, b) =>
              Math.abs(row.seats.indexOf(a) - midSeatIdx) -
              Math.abs(row.seats.indexOf(b) - midSeatIdx)
          )
        available.push(...sortedSeats)
      }
    }

    const toSelect = available.slice(0, bestCount)
    toSelect.forEach((s) => addSeat({ ...s, status: 'selected' }))
    if (toSelect.length > 0) {
      toast(`Selected ${toSelect.length} best available seats!`, 'success')
    } else {
      toast('No available seats found', 'error')
    }
  }, [seatLayout, bestCount, clearSeats, addSeat])

  // ── Proceed ──
  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      toast('Please select at least one seat', 'warning')
      return
    }
    navigate(`/book/${showId}/fnb`)
  }

  if (!show || !movie || !cinema) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Armchair className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-400">Show not found. Please select a showtime first.</p>
          <button
            onClick={() => navigate('/movies')}
            className="mt-4 px-4 py-2 bg-primary rounded-lg text-sm"
          >
            Browse Movies
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-32">
      {/* ── Top Bar ── */}
      <div className="sticky top-16 z-30 bg-background/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-base md:text-lg truncate">
              {movie.title}
            </h1>
            <div className="flex items-center gap-3 text-xs text-zinc-400 mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {cinema.name}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(show.date)} • {formatTime(show.time)}
              </span>
              <span className="flex items-center gap-1">
                <Film className="w-3 h-3" />
                {show.format} • {show.language}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Seat Map ── */}
      <div className="max-w-4xl mx-auto px-4 pt-6">


        {/* Best Available Controls */}
        <div className="flex items-center justify-between mb-6 glass-card p-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent-amber" />
            <span className="text-sm font-medium">Best Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white/5 rounded-lg border border-white/10 overflow-hidden">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => setBestCount(n)}
                  className={cn(
                    'w-8 h-8 text-xs font-medium transition-all',
                    bestCount === n
                      ? 'bg-primary text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              onClick={handleBestAvailable}
              className="px-3 py-1.5 bg-primary/20 text-primary text-xs font-medium rounded-lg border border-primary/30 hover:bg-primary/30 transition-colors"
            >
              Find
            </button>
          </div>
        </div>

        {/* 3D Tilted Seat Map Container */}
        <div
          className="overflow-x-auto pb-4"
          style={{
            perspective: '1200px',
          }}
        >
          <div
            className="min-w-[600px] px-4"
            style={{
              transform: 'rotateX(5deg)',
              transformOrigin: 'center top',
            }}
          >
            {seatLayout.sections.map((section) => (
              <SeatSectionBlock
                key={section.category}
                section={section}
                selectedIds={selectedIds}
                onToggleSeat={handleToggleSeat}
              />
            ))}
            
                {/* Screen */}
          <div className="relative mb-10">
            <div className="screen-glow absolute -top-4 left-1/2 -translate-x-1/2 w-3/4 h-16" />
            <div className="relative mx-auto w-3/4 md:w-2/3">
              <div
                className="h-2 rounded-b-[100%] bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20"
                style={{
                  boxShadow: '0 0 40px rgba(124, 58, 237, 0.3), 0 4px 20px rgba(124, 58, 237, 0.2)',
                }}
              />
              <p className="text-center text-[10px] uppercase tracking-[0.3em] text-primary/60 mt-2 font-medium">
                Screen This Way
              </p>
            </div>
          </div>

          </div>
          
        </div>
        

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded seat-available" />
            <span className="text-zinc-400">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded seat-selected" />
            <span className="text-zinc-400">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded seat-occupied" />
            <span className="text-zinc-400">Occupied</span>
          </div>
        </div>

        {/* Pricing Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs text-zinc-400">
          {seatLayout.sections.map((section) => {
            const cfg = CATEGORY_CONFIG[section.category]
            return (
              <span key={section.category} className="flex items-center gap-1">
                <span>{cfg.emoji}</span>
                <span className={cfg.color}>{cfg.label}</span>
                <span>— {formatCurrency(section.price)}</span>
              </span>
            )
          })}
        </div>
      </div>

      {/* ── Bottom Sticky Summary ── */}
      <AnimatePresence>
        {selectedSeats.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-40 md:bottom-0"
          >
            <div className="bg-surface/95 backdrop-blur-xl border-t border-white/10 shadow-2xl">
              <div className="max-w-5xl mx-auto px-4 py-3 md:py-4">
                <div className="flex items-center justify-between gap-4">
                  {/* Left side — seat info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Armchair className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm font-medium">
                        {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''}
                      </span>
                      <button
                        onClick={clearSeats}
                        className="text-[10px] text-zinc-500 hover:text-accent-coral transition-colors ml-1"
                      >
                        Clear
                      </button>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5 truncate">
                      {selectedSeats
                        .map((s) => `${s.row}${s.number}`)
                        .sort()
                        .join(', ')}
                    </p>
                  </div>

                  {/* Right side — price + proceed */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold">{formatCurrency(subtotal)}</p>
                      <p className="text-[10px] text-zinc-500">+ taxes</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleProceed}
                      className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark rounded-xl font-medium text-sm transition-colors shadow-glow-sm"
                    >
                      Proceed
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info message when no seats */}
      {selectedSeats.length === 0 && (
        <div className="max-w-4xl mx-auto px-4 mt-8">
          <div className="flex items-center gap-2 text-xs text-zinc-500 justify-center">
            <Info className="w-4 h-4" />
            <span>Tap on available seats to select. You can select up to {MAX_SEATS} seats.</span>
          </div>
        </div>
      )}
    </div>
  )
}
