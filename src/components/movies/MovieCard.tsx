import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Clock, Ticket } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Movie } from '@/types'

interface MovieCardProps {
  movie: Movie
  variant?: 'featured' | 'default' | 'compact'
  className?: string
  index?: number
}

const languageFlags: Record<string, string> = {
  Hindi: '🇮🇳',
  English: '🇬🇧',
  Telugu: '🇮🇳',
  Tamil: '🇮🇳',
  Malayalam: '🇮🇳',
  Kannada: '🇮🇳',
}

export default function MovieCard({
  movie,
  variant = 'default',
  className,
  index = 0,
}: MovieCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const sizeClasses = {
    featured: 'w-[280px] md:w-[320px]',
    default: 'w-[200px] md:w-[220px]',
    compact: 'w-[160px] md:w-[180px]',
  }

  const posterHeightClasses = {
    featured: 'h-[400px] md:h-[460px]',
    default: 'h-[280px] md:h-[310px]',
    compact: 'h-[220px] md:h-[250px]',
  }

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return `${h}h ${m}m`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={cn('flex-shrink-0', sizeClasses[variant], className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/movies/${movie.id}`} className="group block">
        {/* Poster Container */}
        <div
          className={cn(
            'relative overflow-hidden rounded-2xl',
            posterHeightClasses[variant],
            'transition-all duration-300',
            isHovered && 'shadow-glow-md'
          )}
        >
          {/* Shimmer Loading State */}
          {!imageLoaded && (
            <div className="absolute inset-0 shimmer rounded-2xl bg-surface-light" />
          )}

          {/* Poster Image */}
          <motion.img
            src={movie.posterUrl}
            alt={movie.title}
            className={cn(
              'h-full w-full object-cover transition-opacity duration-500',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setImageLoaded(true)}
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            transition={{ duration: 0.4 }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

          {/* Glow Border on Hover */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-primary/0 transition-colors duration-300"
            animate={isHovered ? { borderColor: 'rgba(124, 58, 237, 0.6)' } : { borderColor: 'rgba(124, 58, 237, 0)' }}
          />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            {/* IMDB Rating */}
            {movie.rating.imdb > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-sm px-2.5 py-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold text-white">
                  {movie.rating.imdb.toFixed(1)}
                </span>
              </div>
            )}

            {/* Language Flag */}
            <div className="rounded-full bg-black/70 backdrop-blur-sm px-2.5 py-1">
              <span className="text-xs font-medium">
                {languageFlags[movie.language] || '🌍'} {movie.language}
              </span>
            </div>
          </div>

          {/* Certification Badge */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2">
            <div
              className={cn(
                'rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider border',
                movie.certification === 'A'
                  ? 'border-accent-coral/60 bg-accent-coral/20 text-accent-coral'
                  : movie.certification === 'UA'
                    ? 'border-amber-400/60 bg-amber-400/20 text-amber-400'
                    : 'border-accent-green/60 bg-accent-green/20 text-accent-green'
              )}
            >
              {movie.certification}
            </div>
          </div>

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Genres */}
            {variant !== 'compact' && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {movie.genres.slice(0, variant === 'featured' ? 3 : 2).map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full bg-white/10 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-medium text-zinc-200"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Duration */}
            {variant === 'featured' && (
              <div className="mb-2 flex items-center gap-1 text-zinc-400">
                <Clock className="h-3 w-3" />
                <span className="text-[11px]">{formatDuration(movie.duration)}</span>
              </div>
            )}

            {/* Book Now Button (shows on hover) */}
            <motion.div
              initial={false}
              animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center gap-2 rounded-xl bg-primary py-2 text-sm font-semibold text-white shadow-glow-sm transition-all hover:bg-primary-dark">
                <Ticket className="h-4 w-4" />
                Book Now
              </div>
            </motion.div>
          </div>
        </div>

        {/* Title & Info Below Poster */}
        <div className="mt-3 px-1">
          <h3
            className={cn(
              'font-semibold text-white truncate transition-colors group-hover:text-primary-light',
              variant === 'featured' ? 'text-base' : variant === 'compact' ? 'text-xs' : 'text-sm'
            )}
          >
            {movie.title}
          </h3>

          {variant !== 'compact' && (
            <p className="mt-0.5 text-xs text-zinc-500 truncate">
              {movie.genres.join(' • ')}
            </p>
          )}

          {variant === 'featured' && (
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-xs text-zinc-400">
                {formatDuration(movie.duration)}
              </span>
              <span className="text-xs font-medium text-primary-light">
                ₹{movie.priceFrom}+
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
