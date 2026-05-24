import { useEffect, useRef, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import confetti from 'canvas-confetti'
import { CheckCircle, Copy, Share2, Download, Calendar, Home, ChevronRight } from 'lucide-react'
import { cn, formatCurrency, formatDate, formatTime } from '@/lib/utils'
import { useBookingStore, useUserBookingsStore } from '@/store'
import { movies } from '@/data/mockData'
import type { Booking } from '@/types'

function RelatedMovieCard({ movie }: { movie: typeof movies[0] }) {
  const navigate = useNavigate()
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/movies/${movie.id}`)}
      className="shrink-0 w-36 cursor-pointer"
    >
      <div className="rounded-xl overflow-hidden aspect-[2/3] bg-surface">
        <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
      </div>
      <p className="text-xs font-medium mt-2 truncate">{movie.title}</p>
    </motion.div>
  )
}

export default function BookingConfirmationPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  const { draft, reset } = useBookingStore()
  const { addBooking } = useUserBookingsStore()
  const [copied, setCopied] = useState(false)
  const ticketRef = useRef<HTMLDivElement>(null)

  const movie = draft.movie
  const show = draft.show
  const cinema = draft.cinema
  const seats = draft.selectedSeats
  const total = useBookingStore.getState().getTotal()

  // Confetti on mount and save booking
  useEffect(() => {
    // Save booking to user bookings store
    if (movie && show && cinema && bookingId) {
      const newBooking: Booking = {
        id: bookingId,
        movieId: movie.id,
        movie,
        cinemaId: cinema.id,
        cinema,
        showId: show.id,
        show,
        seats,
        fnbItems: draft.fnbItems,
        subtotal: useBookingStore.getState().getSubtotal(),
        convenienceFee: useBookingStore.getState().getConvenienceFee(),
        discount: draft.discount,
        total: useBookingStore.getState().getTotal(),
        paymentMethod: 'Credit Card',
        status: 'confirmed' as const,
        bookedAt: new Date().toISOString(),
        qrCode: bookingId,
      }
      addBooking(newBooking)
    }

    const fire = (opts: confetti.Options) => confetti({ ...opts, zIndex: 9999 })
    setTimeout(() => {
      fire({ angle: 60, spread: 70, particleCount: 80, origin: { x: 0, y: 0.6 }, colors: ['#7C3AED', '#2563EB', '#FF4757'] })
      fire({ angle: 120, spread: 70, particleCount: 80, origin: { x: 1, y: 0.6 }, colors: ['#7C3AED', '#06B6D4', '#F59E0B'] })
    }, 400)
  }, [bookingId, movie, show, cinema, seats, addBooking])

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingId ?? '').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${movie?.title} — MovieSNow`,
        text: `I just booked tickets for ${movie?.title}! Booking ID: ${bookingId}`,
        url: window.location.href,
      })
    } else {
      handleCopy()
    }
  }

  const relatedMovies = movies.filter(m => m.id !== movie?.id).slice(0, 6)

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Success heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6, delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-accent-green/10 border-2 border-accent-green flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-10 h-10 text-accent-green" />
          </motion.div>
          <h1 className="text-3xl font-display font-black">Booking Confirmed!</h1>
          <p className="text-zinc-400 mt-2">Your seats are reserved. Enjoy the show! 🍿</p>
        </motion.div>

        {/* Ticket Card */}
        <motion.div
          ref={ticketRef}
          initial={{ opacity: 0, rotateY: 90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          transition={{ type: 'spring', duration: 0.8, delay: 0.4 }}
          style={{ perspective: '1000px' }}
          className="relative"
        >
          <div className="relative bg-gradient-to-br from-surface to-surface-light border border-white/10 rounded-2xl overflow-visible shadow-2xl">
            {/* Top half */}
            <div className="p-6">
              <div className="flex gap-4">
                {movie && (
                  <img src={movie.posterUrl} alt={movie.title} className="w-20 h-28 rounded-xl object-cover shrink-0 shadow-lg" />
                )}
                <div className="flex-1">
                  <h2 className="font-display font-bold text-xl">{movie?.title}</h2>
                  <p className="text-zinc-400 text-sm mt-1">{cinema?.name}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{cinema?.address}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Date</p>
                      <p className="font-medium">{show ? formatDate(show.date) : '—'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Time</p>
                      <p className="font-medium">{show ? formatTime(show.time) : '—'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Format</p>
                      <p className="font-medium">{show?.format}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seats */}
              {seats.length > 0 && (
                <div className="mt-4">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Seats</p>
                  <div className="flex flex-wrap gap-2">
                    {seats.map(s => (
                      <span key={s.id} className="px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-sm font-mono font-semibold text-primary">
                        {s.row}{s.number}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dashed divider with punch holes */}
            <div className="relative flex items-center gap-0 px-0">
              <div className="absolute -left-3 w-6 h-6 rounded-full bg-background" />
              <div className="flex-1 border-t-2 border-dashed border-white/10 mx-5" />
              <div className="absolute -right-3 w-6 h-6 rounded-full bg-background" />
            </div>

            {/* Bottom half */}
            <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
              {/* QR Code */}
              <div className="shrink-0 p-3 bg-white rounded-2xl shadow-lg">
                <QRCodeSVG
                  value={bookingId ?? 'MSN000000'}
                  size={100}
                  bgColor="#FFFFFF"
                  fgColor="#0A0A0F"
                  level="H"
                />
              </div>

              <div className="flex-1 w-full">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Booking ID</p>
                    <p className="font-mono font-bold text-lg tracking-wider text-primary">{bookingId}</p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                      copied
                        ? 'bg-accent-green/10 border-accent-green/30 text-accent-green'
                        : 'bg-white/5 border-white/10 hover:border-primary/30 text-zinc-400'
                    )}
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
                  <span className="text-zinc-400 text-sm">Amount Paid</span>
                  <span className="font-bold text-lg">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-3 mt-6"
        >
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 text-sm font-medium transition-all"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button
            onClick={() => {
              const d = new Date(show?.date ?? Date.now())
              const title = encodeURIComponent(`${movie?.title} at ${cinema?.name}`)
              window.open(`https://calendar.google.com/calendar/r/eventedit?text=${title}&dates=${d.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`, '_blank')
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-accent-blue/30 text-sm font-medium transition-all"
          >
            <Calendar className="w-4 h-4" /> Calendar
          </button>
        </motion.div>

        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6"
        >
          <button
            onClick={() => { reset(); navigate('/') }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-sm font-semibold transition-colors shadow-glow-sm"
          >
            <Home className="w-4 h-4" /> Back to Home
          </button>
        </motion.div>

        {/* Related Movies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-12"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-bold">You Might Also Like</h2>
            <Link to="/movies" className="text-primary text-sm flex items-center gap-1">
              See All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {relatedMovies.map(m => <RelatedMovieCard key={m.id} movie={m} />)}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
