import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star, Clock, Calendar, Play, Heart, Bookmark, X, MapPin, ChevronLeft, ChevronRight, Wifi, ParkingSquare, Coffee, Accessibility
} from 'lucide-react'
import { cn, formatCurrency, formatTime, formatDate } from '@/lib/utils'
import { movies, cinemas, shows } from '@/data/mockData'
import { useBookingStore } from '@/store'
import { format, addDays } from 'date-fns'

// Convert YouTube URL to embed format
function getEmbedUrl(url: string): string {
  if (!url) return ''
  
  // If already in embed format, return as is
  if (url.includes('youtube.com/embed/') || url.includes('youtu.be/embed/')) {
    return url
  }
  
  // Convert youtube.com/watch?v=ID to embed format
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0]
    return `https://www.youtube.com/embed/${videoId}`
  }
  
  // Convert youtu.be/ID to embed format
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0]
    return `https://www.youtube.com/embed/${videoId}`
  }
  
  return url
}

function RatingRing({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const r = 28, circ = 2 * Math.PI * r
  const filled = value > 0 ? (value / max) * circ : 0
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
          <motion.circle
            cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            whileInView={{ strokeDashoffset: circ - filled }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {value > 0
            ? <span className="text-sm font-bold">{value}</span>
            : <span className="text-xs text-zinc-500">N/A</span>
          }
        </div>
      </div>
      <p className="text-[10px] text-zinc-500 text-center leading-tight">{label}</p>
    </div>
  )
}

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { setMovie, setCinema, setShow } = useBookingStore()
  const movie = movies.find((m) => m.id === id)

  const [showTrailer, setShowTrailer] = useState(false)
  const [synopsisExpanded, setSynopsisExpanded] = useState(false)
  const [liked, setLiked] = useState(false)
  const [watchlisted, setWatchlisted] = useState(false)
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Movie not found</p>
          <button onClick={() => navigate('/movies')} className="px-4 py-2 bg-primary rounded-lg text-sm">
            Browse Movies
          </button>
        </div>
      </div>
    )
  }

  const movieShows = shows.filter((s) => s.movieId === movie.id)
  const cinemaIds = [...new Set(movieShows.map((s) => s.cinemaId))]
  const movieCinemas = cinemaIds.map((cid) => cinemas.find((c) => c.id === cid)!).filter(Boolean)

  const dateStrip = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(new Date(), i)
    return { date: format(d, 'yyyy-MM-dd'), day: format(d, 'EEE'), num: format(d, 'd') }
  })

  const handleSelectShow = (showItem: typeof movieShows[0]) => {
    const cinema = cinemas.find((c) => c.id === showItem.cinemaId)
    if (!cinema) return
    setMovie(movie)
    setCinema(cinema)
    setShow(showItem)
    navigate(`/book/${showItem.id}`)
  }

  const getAvailColor = (available: number, total: number) => {
    const pct = available / total
    if (pct > 0.6) return 'border-accent-green/40 text-accent-green hover:bg-accent-green/10'
    if (pct > 0.3) return 'border-accent-amber/40 text-accent-amber hover:bg-accent-amber/10'
    return 'border-accent-coral/40 text-accent-coral hover:bg-accent-coral/10'
  }

  const facilityIcons: Record<string, React.ElementType> = {
    'Dolby Atmos': Wifi, Recliner: Coffee, 'F&B': Coffee, Parking: ParkingSquare,
    'Wheelchair Access': Accessibility, IMAX: Star, '4DX': Star, 'VIP Lounge': Star,
  }

  return (
    <div className="min-h-screen">
      {/* Backdrop Hero */}
      <div className="relative h-64 sm:h-80 md:h-[420px] overflow-hidden">
        <img
          src={movie.backdropUrl} alt={movie.title}
          className="w-full h-full object-cover scale-110"
          style={{ filter: 'blur(2px)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent" />

        {/* Back + actions */}
        <div className="absolute top-20 left-4 right-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setLiked(!liked)}
              className="p-2 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10"
            >
              <Heart className={cn('w-5 h-5 transition-colors', liked ? 'fill-accent-coral text-accent-coral' : 'text-white')} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setWatchlisted(!watchlisted)}
              className="p-2 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10"
            >
              <Bookmark className={cn('w-5 h-5 transition-colors', watchlisted ? 'fill-primary text-primary' : 'text-white')} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Movie Info */}
      <div className="max-w-6xl mx-auto px-4 -mt-36 md:-mt-48 relative z-10">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-36 sm:w-48 md:w-52 shrink-0"
          >
            <img
              src={movie.posterUrl} alt={movie.title}
              className="w-full rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10"
            />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 pt-4 sm:pt-20"
          >
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded border border-white/20 text-xs font-medium text-zinc-300">
                {movie.certification}
              </span>
              {movie.genres.map(g => (
                <span key={g} className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary">
                  {g}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-black">{movie.title}</h1>
            <p className="text-zinc-400 mt-1 italic">{movie.tagline}</p>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {movie.releaseDate}
              </span>
              {movie.rating.imdb > 0 && (
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-accent-amber fill-accent-amber" />
                  <span className="font-semibold text-white">{movie.rating.imdb}</span>/10 IMDB
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {movie.formats.map(f => (
                <span key={f} className="px-3 py-1 rounded-lg bg-accent-blue/10 border border-accent-blue/20 text-xs font-medium text-accent-blue">
                  {f}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowTrailer(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark rounded-xl font-semibold text-sm transition-colors shadow-glow-sm"
              >
                <Play className="w-4 h-4 fill-white" /> Watch Trailer
              </button>
              <div className="text-sm text-zinc-400">
                Director: <span className="text-white font-medium">{movie.director}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Synopsis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 glass-card p-6"
        >
          <h2 className="text-xl font-display font-bold mb-3">Synopsis</h2>
          <p className={cn('text-zinc-400 text-sm leading-relaxed', !synopsisExpanded && 'line-clamp-3')}>
            {movie.synopsis}
          </p>
          <button
            onClick={() => setSynopsisExpanded(!synopsisExpanded)}
            className="text-primary text-sm mt-2 hover:underline"
          >
            {synopsisExpanded ? 'Read Less' : 'Read More'}
          </button>
        </motion.div>

        {/* Cast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h2 className="text-xl font-display font-bold mb-4">Cast</h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {movie.cast.map(member => (
              <div key={member.name} className="flex flex-col items-center gap-2 shrink-0 w-20">
                <div className="w-16 h-16 rounded-full bg-surface border-2 border-white/10 overflow-hidden">
                  <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-medium text-center leading-tight">{member.name}</p>
                <p className="text-[10px] text-zinc-500 text-center leading-tight">{member.role}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Ratings */}
        {movie.rating.imdb > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 glass-card p-6"
          >
            <h2 className="text-xl font-display font-bold mb-6">Ratings</h2>
            <div className="flex items-center justify-around">
              <RatingRing value={movie.rating.imdb} max={10} label="IMDB Rating" color="#F59E0B" />
              <RatingRing value={movie.rating.rottenTomatoes} max={100} label="Rotten Tomatoes" color="#EF4444" />
              <RatingRing value={movie.rating.userRating} max={10} label="User Rating" color="#7C3AED" />
            </div>
          </motion.div>
        )}

        {/* Show Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 mb-16"
        >
          <h2 className="text-xl font-display font-bold mb-4">Select Showtime</h2>

          {/* Date Picker Strip */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
            {dateStrip.map(({ date, day, num }) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl border text-xs font-medium shrink-0 transition-all',
                  selectedDate === date
                    ? 'bg-primary border-primary text-white shadow-glow-sm'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:border-primary/30'
                )}
              >
                <span className="text-[10px] uppercase">{day}</span>
                <span className="text-lg font-bold">{num}</span>
              </button>
            ))}
          </div>

          {/* Cinema List */}
          <div className="space-y-4">
            {movieCinemas.map((cinema) => {
              const dayShows = movieShows
                .filter((s) => s.cinemaId === cinema.id && s.date === selectedDate)
                .slice(0, 8)

              return (
                <div key={cinema.id} className="glass-card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{cinema.name}</h3>
                      <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {cinema.address} • {cinema.distance} km
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1 max-w-36">
                      {cinema.facilities.slice(0, 3).map(f => (
                        <span key={f} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-500">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {dayShows.length === 0 ? (
                    <p className="text-sm text-zinc-500">No shows on this date.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {dayShows.map((show) => (
                        <button
                          key={show.id}
                          onClick={() => handleSelectShow(show)}
                          className={cn(
                            'px-3 py-2 rounded-lg border text-sm transition-all',
                            getAvailColor(show.availableSeats, show.totalSeats)
                          )}
                        >
                          <div className="font-medium">{formatTime(show.time)}</div>
                          <div className="text-[9px] mt-0.5">{show.format} • {show.language}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Trailer Modal */}
      <AnimatePresence>
        {showTrailer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowTrailer(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.4 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-3xl rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="font-semibold">{movie.title} — Official Trailer</h3>
                <button onClick={() => setShowTrailer(false)} className="p-1 hover:bg-white/5 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="aspect-video bg-black">
                <iframe
                  src={getEmbedUrl(movie.trailerUrl) + '?autoplay=1&modestbranding=1'}
                  className="w-full h-full border-0"
                  title={`${movie.title} Trailer`}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
