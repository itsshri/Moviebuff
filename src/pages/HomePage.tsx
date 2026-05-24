import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  Play, Star, MapPin, ChevronRight, ChevronLeft, Search, Flame, Calendar,
  Tag, Copy, Check as CheckIcon, Bell, BellOff, Users, TrendingUp
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { movies, cities, promoCodes } from '@/data/mockData'
import { useCityStore, useSearchStore } from '@/store'
import type { Movie } from '@/types'

// ── Magic UI Particles (inline) ──────────────────────────────
function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let w = (canvas.width = canvas.offsetWidth)
    let h = (canvas.height = canvas.offsetHeight)
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4, dy: (Math.random() - 0.5) * 0.4,
      o: Math.random() * 0.5 + 0.1,
    }))
    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(124,58,237,${p.o})`
        ctx.fill()
        p.x += p.dx; p.y += p.dy
        if (p.x < 0 || p.x > w) p.dx *= -1
        if (p.y < 0 || p.y > h) p.dy *= -1
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    const onResize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

// ── Animated Gradient Text ────────────────────────────────────
function GradientText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn(
      'inline-block animate-gradient-shift bg-clip-text text-transparent',
      'bg-[length:300%_300%]',
      className
    )}
      style={{ backgroundImage: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 33%, #FF4757 66%, #8B5CF6 100%)' }}
    >
      {children}
    </span>
  )
}

// ── Countdown Timer ───────────────────────────────────────────
function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 })
  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff <= 0) return
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
      })
    }
    calc()
    const id = setInterval(calc, 60000)
    return () => clearInterval(id)
  }, [targetDate])

  return (
    <div className="flex items-center gap-2">
      {[
        { label: 'D', value: timeLeft.days },
        { label: 'H', value: timeLeft.hours },
        { label: 'M', value: timeLeft.mins },
      ].map(({ label, value }) => (
        <div key={label} className="text-center">
          <div className="w-9 h-9 bg-white/10 border border-white/10 rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold font-mono text-primary">{String(value).padStart(2, '0')}</span>
          </div>
          <p className="text-[9px] text-zinc-500 mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  )
}

// ── Seed-based random (stable per movie id) ────────────────────
function seededRand(seed: string, min: number, max: number): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash << 5) - hash + seed.charCodeAt(i)
  return min + Math.abs(hash % (max - min + 1))
}
function fmtCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${Math.floor(n / 1_000)}k`
  return String(n)
}

// ── Coming Soon Card ──────────────────────────────────────────
function ComingSoonCard({ movie }: { movie: Movie }) {
  const navigate = useNavigate()
  const baseCount = seededRand(movie.id, 12_000, 420_000)
  const [notified, setNotified] = useState(false)
  const [count, setCount] = useState(baseCount)
  const [burst, setBurst] = useState(false)

  const handleNotify = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (notified) { setNotified(false); setCount(c => c - 1); return }
    setNotified(true)
    setCount(c => c + 1)
    setBurst(true)
    setTimeout(() => setBurst(false), 600)
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/movies/${movie.id}`)}
      className="relative glass-card-hover p-4 flex gap-4 cursor-pointer overflow-hidden group"
    >
      {/* Poster */}
      <div className="w-20 h-28 rounded-xl overflow-hidden shrink-0 relative">
        <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
        {/* Formats over poster */}
        <div className="absolute bottom-1 left-1 right-1 flex flex-wrap gap-0.5">
          {movie.formats.slice(0, 2).map(f => (
            <span key={f} className="px-1 text-[7px] rounded bg-black/80 text-accent-blue font-bold">{f}</span>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-bold text-sm leading-tight">{movie.title}</h3>

          {/* Notify Me button */}
          <motion.button
            onClick={handleNotify}
            whileTap={{ scale: 0.85 }}
            animate={burst ? { scale: [1, 1.35, 1] } : {}}
            transition={{ duration: 0.35 }}
            className={cn(
              'shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border',
              notified
                ? 'bg-primary/15 border-primary/40 text-primary'
                : 'bg-white/5 border-white/10 text-zinc-500 hover:border-white/25 hover:text-zinc-300'
            )}
            title={notified ? 'Remove notification' : 'Notify me on release'}
          >
            {notified
              ? <Bell className="w-3.5 h-3.5 fill-primary" />
              : <Bell className="w-3.5 h-3.5" />
            }
          </motion.button>
        </div>

        <p className="text-[11px] text-zinc-500 mt-0.5">{movie.genres.slice(0, 2).join(' · ')}</p>

        {/* Release date */}
        <div className="flex items-center gap-1.5 mt-2">
          <Calendar className="w-3 h-3 text-accent-blue" />
          <span className="text-[11px] text-zinc-400">{movie.releaseDate}</span>
        </div>

        {/* Countdown */}
        <div className="mt-2">
          <Countdown targetDate={movie.releaseDate} />
        </div>

        {/* Awaiting count row */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-300',
              notified ? 'bg-primary/10 border border-primary/20' : 'bg-white/5 border border-white/8'
            )}>
              <Users className={cn('w-3 h-3', notified ? 'text-primary' : 'text-zinc-500')} />
              <motion.span
                key={count}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('text-[11px] font-bold tabular-nums', notified ? 'text-primary' : 'text-zinc-400')}
              >
                {fmtCount(count)}
              </motion.span>
              <span className="text-[10px] text-zinc-600">awaiting</span>
            </div>

            {notified && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-accent-green/10 border border-accent-green/25"
              >
                <TrendingUp className="w-3 h-3 text-accent-green" />
                <span className="text-[10px] font-semibold text-accent-green">You're in!</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}


const VIBE_MAP: Record<string, { label: string; accent: string }> = {
  'mov-1':  { label: 'BLOCKBUSTER',   accent: '#F97316' },
  'mov-2':  { label: 'MUST WATCH',    accent: '#FBBF24' },
  'mov-3':  { label: 'ROMANTIC',      accent: '#F472B6' },
  'mov-4':  { label: 'BLOCKBUSTER',   accent: '#F97316' },
  'mov-5':  { label: 'LEGENDARY',     accent: '#A78BFA' },
  'mov-6':  { label: 'BLOCKBUSTER',   accent: '#F97316' },
  'mov-7':  { label: 'GRIPPY',        accent: '#38BDF8' },
  'mov-8':  { label: 'ENTERTAINER',   accent: '#34D399' },
  'mov-10': { label: 'MASSIVE',       accent: '#FB923C' },
  'mov-11': { label: 'THALAIVAR',     accent: '#FBBF24' },
  'mov-12': { label: 'HORROR',        accent: '#C084FC' },
  'mov-13': { label: 'ADVENTURE',     accent: '#60A5FA' },
  'mov-14': { label: 'ACTION',        accent: '#F87171' },
  'mov-15': { label: 'BLOCKBUSTER',   accent: '#F97316' },
  'mov-16': { label: 'MASS BLAST',    accent: '#FCD34D' },
  'mov-17': { label: 'MASTERPIECE',   accent: '#38BDF8' },
  'mov-18': { label: 'OSCAR WINNER',  accent: '#FDE68A' },
  'mov-19': { label: 'EPIC MARVEL',   accent: '#818CF8' },
  'mov-20': { label: 'FAN FAVOURITE', accent: '#F87171' },
  'mov-21': { label: 'DARK DRAMA',    accent: '#94A3B8' },
}

// ── Rating Stars ──────────────────────────────────────────────
function RatingStars({ score }: { score: number }) {
  const filled = Math.round(score / 2) // out of 5 stars
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'w-2.5 h-2.5',
            i < filled ? 'text-accent-amber fill-accent-amber' : 'text-zinc-700 fill-zinc-700'
          )}
        />
      ))}
    </div>
  )
}

// ── Movie Card Component ──────────────────────────────────────
function MovieCard({ movie, size = 'md' }: { movie: Movie; size?: 'lg' | 'md' | 'sm' }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  const vibe = VIBE_MAP[movie.id]

  const dims = {
    lg: 'w-52 md:w-64',
    md: 'w-40 md:w-48',
    sm: 'w-32 md:w-36',
  }[size]

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => navigate(`/movies/${movie.id}`)}
      className={cn('shrink-0 cursor-pointer group', dims)}
    >
      {/* Poster area */}
      <div
        className={cn(
          'relative rounded-2xl overflow-hidden aspect-[2/3] bg-surface transition-shadow duration-300',
          hovered && vibe ? 'shadow-glow-sm' : ''
        )}
      >
        {/* Shimmer loader */}
        {!imgLoaded && <div className="absolute inset-0 shimmer" />}

        <img
          src={movie.posterUrl}
          alt={movie.title}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-500',
            imgLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setImgLoaded(true)}
          loading="lazy"
        />

        {/* Gradient overlay — stronger on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-95 transition-opacity duration-300" />

        {/* Certification chip — top left */}
        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-black/60 border border-white/15 text-[9px] font-bold text-zinc-300 backdrop-blur-sm">
          {movie.certification}
        </div>

        {/* IMDb Rating badge — top right, premium bold style */}
        {movie.rating.imdb > 0 && (
          <div
            className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl backdrop-blur-md border border-amber-400/40"
            style={{ background: 'linear-gradient(135deg, rgba(20,10,0,0.85), rgba(40,25,0,0.85))' }}
          >
            <Star className="w-3 h-3 fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]" />
            <div className="flex items-baseline gap-0.5">
              <span
                className="text-sm font-black text-amber-300 leading-none"
                style={{ textShadow: '0 0 8px rgba(251,191,36,0.7)' }}
              >
                {movie.rating.imdb}
              </span>
              <span className="text-[9px] text-amber-600/80 font-semibold">/10</span>
            </div>
          </div>
        )}

        {/* Vibe badge — always visible, subtle dark-glass style */}
        {vibe && (
          <div className="absolute bottom-14 left-2">
            <div
              className="flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-md backdrop-blur-md"
              style={{
                background: 'rgba(10, 10, 15, 0.72)',
                borderLeft: `2px solid ${vibe.accent}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
              }}
            >
              <span
                className="text-[8px] font-bold tracking-[0.14em] uppercase leading-none"
                style={{ color: 'rgba(255,255,255,0.88)' }}
              >
                {vibe.label}
              </span>
            </div>
          </div>
        )}

        {/* Bottom hover panel — Book Now only */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button className="w-full py-2.5 bg-primary hover:bg-primary-dark rounded-xl text-xs font-bold tracking-wide transition-colors shadow-glow-sm">
            Book Now • {formatCurrency(movie.priceFrom)}
          </button>
        </div>
      </div>

      {/* Below poster info */}
      <div className="mt-2.5 px-0.5">
        <h3 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{movie.title}</h3>
        <div className="flex items-center justify-between mt-1">
          <div className="flex gap-1 flex-wrap">
            {movie.genres.slice(0, 2).map(g => (
              <span key={g} className="px-1.5 py-0.5 text-[9px] bg-white/5 border border-white/8 rounded-full text-zinc-500">
                {g}
              </span>
            ))}
          </div>
          <span className="text-[9px] text-zinc-600 shrink-0">{movie.language}</span>
        </div>
      </div>
    </motion.div>
  )
}


// ── Horizontal Scroll Section ─────────────────────────────────
function HScrollSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: 'l' | 'r') => {
    ref.current?.scrollBy({ left: dir === 'r' ? 300 : -300, behavior: 'smooth' })
  }
  return (
    <div className={cn('relative group', className)}>
      <button
        onClick={() => scroll('l')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-4 w-10 h-10 rounded-full bg-surface/90 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div ref={ref} className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {children}
      </div>
      <button
        onClick={() => scroll('r')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-4 w-10 h-10 rounded-full bg-surface/90 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

// ── Footer Newsletter with subscribed state ──────────────────────
function FooterNewsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    await new Promise(r => setTimeout(r, 1000))
    setStatus('done')
  }

  if (status === 'done') return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-2 py-5 px-4 rounded-2xl bg-accent-green/10 border border-accent-green/20 text-center"
    >
      <span className="text-2xl">🎉</span>
      <p className="text-sm font-bold text-accent-green">You're subscribed!</p>
      <p className="text-xs text-zinc-500">Check your inbox for your promo code.</p>
    </motion.div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <div className="relative">
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full h-11 rounded-xl bg-white/5 border border-white/10 pl-4 pr-10 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-primary/50 transition-all"
        />
      </div>
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={status === 'loading'}
        className="w-full h-11 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-semibold shadow-glow-sm transition-all disabled:opacity-70 flex items-center justify-center gap-2"
      >
        {status === 'loading' ? (
          <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Subscribing...</>
        ) : 'Subscribe for Free'}
      </motion.button>
      <p className="text-[10px] text-zinc-600 text-center">No spam. Unsubscribe anytime.</p>
    </form>
  )
}

// ── Promo Carousel ────────────────────────────────────────────
const PROMO_COLORS = [
  { from: '#7C3AED', to: '#3B82F6', accent: '#8B5CF6' },
  { from: '#FF4757', to: '#F59E0B', accent: '#FF6B81' },
  { from: '#10B981', to: '#3B82F6', accent: '#34D399' },
]

function PromoCarousel() {
  const codes = promoCodes
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  // Auto-advance every 4 s
  useEffect(() => {
    const id = setInterval(() => setActive(a => (a + 1) % codes.length), 4000)
    return () => clearInterval(id)
  }, [codes.length])

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const promo = codes[active]
  const palette = PROMO_COLORS[active % PROMO_COLORS.length]

  return (
    <div className="relative max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={promo.code}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-3xl p-7 md:p-10"
          style={{ background: `linear-gradient(135deg, ${palette.from}22 0%, ${palette.to}18 100%)` }}
        >
          {/* Decorative blobs */}
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-30" style={{ background: palette.from }} />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full blur-2xl opacity-20" style={{ background: palette.to }} />
          <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            {/* Discount badge */}
            <div
              className="shrink-0 w-24 h-24 rounded-2xl flex flex-col items-center justify-center shadow-lg"
              style={{ background: `linear-gradient(135deg, ${palette.from}, ${palette.to})` }}
            >
              <span className="text-3xl font-black text-white">{promo.discount}%</span>
              <span className="text-[10px] text-white/80 font-semibold uppercase tracking-wider">OFF</span>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <Tag className="w-4 h-4" style={{ color: palette.accent }} />
                <span className="text-xs text-zinc-400 uppercase tracking-wider">Exclusive Deal</span>
              </div>
              <h3 className="text-xl md:text-2xl font-display font-black mb-1">{promo.description}</h3>
              <p className="text-xs text-zinc-500">
                Min order ₹{promo.minOrder} &nbsp;·&nbsp; Save up to ₹{promo.maxDiscount} &nbsp;·&nbsp; Valid till {promo.validUntil}
              </p>

              {/* Code + actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-dashed border-white/20">
                  <span className="font-mono font-black text-lg tracking-widest" style={{ color: palette.accent }}>
                    {promo.code}
                  </span>
                  <button
                    onClick={() => handleCopy(promo.code)}
                    className="ml-1 p-1 rounded-lg hover:bg-white/10 transition-colors"
                    title="Copy code"
                  >
                    {copied
                      ? <CheckIcon className="w-4 h-4 text-accent-green" />
                      : <Copy className="w-4 h-4 text-zinc-400" />
                    }
                  </button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/movies')}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white shadow-md transition-colors"
                  style={{ background: `linear-gradient(135deg, ${palette.from}, ${palette.to})` }}
                >
                  Use Now
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {codes.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              i === active ? 'w-8 bg-primary' : 'w-3 bg-white/20'
            )}
          />
        ))}
      </div>
    </div>
  )
}

function SectionHeader({ title, icon: Icon, linkTo, linkLabel = 'See All' }: {
  title: string; icon: React.ElementType; linkTo?: string; linkLabel?: string
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-xl md:text-2xl font-display font-bold">{title}</h2>
      </div>
      {linkTo && (
        <Link to={linkTo} className="text-sm text-primary hover:text-primary-light transition-colors flex items-center gap-1">
          {linkLabel} <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  )
}

// ── Main HomePage ─────────────────────────────────────────────
export default function HomePage() {
  const { selectedCity } = useCityStore()
  const { setOpen: setSearchOpen } = useSearchStore()
  const navigate = useNavigate()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, 150])

  const nowShowing = movies.filter(m => m.status === 'now_showing')
  const trending = movies.filter(m => m.status === 'trending')
  const comingSoon = movies.filter(m => m.status === 'coming_soon')

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <div className="min-h-screen">
      {/* ── Hero Section ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background layers */}
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-conic from-primary/5 via-accent-blue/5 to-accent-coral/5" />
        </motion.div>
        <HeroParticles />

        {/* Animated mesh blobs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/15 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent-blue/15 blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-coral/5 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-32 w-full">
          <div className="text-center max-w-4xl mx-auto">
            {/* <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-6"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Premium Cinema Experience</span>
            </motion.div> */}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-8xl font-display font-black leading-none mb-6 flex items-center gap-4"
            >
              <img src="/cine2.png" alt="MovieBuff" className="w-12 h-12 md:w-20 md:h-20 object-contain" />
              <div>
                <GradientText>Movie</GradientText>
                <span className="text-white">Buff</span>
              </div>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10"
            >
              Your gateway to cinematic magic. Book seats, pick snacks, and experience movies like never before.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {/* Search Bar */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-3 w-full sm:w-96 px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/8 transition-all text-left"
              >
                <Search className="w-5 h-5 text-zinc-500" />
                <span className="text-zinc-500 text-sm flex-1">Search movies, cinemas...</span>
                <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-zinc-500">
                  ⌘K
                </kbd>
              </button>

              <button
                onClick={() => navigate('/movies')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary hover:bg-primary-dark transition-colors font-semibold shadow-glow-sm shrink-0"
              >
                <Play className="w-4 h-4 fill-white" />
                Browse All
              </button>
            </motion.div>

            {/* City selector hint */}
            {!selectedCity && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-6 text-xs text-zinc-500"
              >
                <MapPin className="w-3 h-3 inline mr-1" />
                Select your city from the navbar for local showtimes
              </motion.p>
            )}
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex items-center justify-center gap-8 md:gap-16 mt-20"
          >
            {[
              { value: '500+', label: 'Cinemas' },
              { value: '50+', label: 'Cities' },
              { value: '10M+', label: 'Happy Viewers' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl md:text-3xl font-display font-black gradient-text-purple">{value}</p>
                <p className="text-xs text-zinc-500 mt-1">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        >
          <div className="w-5 h-8 rounded-full border-2 border-white/20 flex items-center justify-center">
            <div className="w-1 h-2 bg-primary rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── CTA Banner ── */}
      {/* ── Promo Carousel ── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <SectionHeader title="Exclusive Offers" icon={Tag} linkTo="/offers" linkLabel="All Offers" />
          <PromoCarousel />
        </motion.div>
      </section>

      {/* ── Now Showing ── */}
      <section className="max-w-8xl mx-auto px-4 py-16">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <SectionHeader title="Now Showing" icon={Play} linkTo="/movies" />
          <HScrollSection>
            {nowShowing.map(movie => (
              <MovieCard key={movie.id} movie={movie} size="lg" />
            ))}
            {/* Padding cards for smooth carousel */}
            {nowShowing.slice(0, 2).map(movie => (
              <MovieCard key={`ns-${movie.id}`} movie={movie} size="lg" />
            ))}
          </HScrollSection>
        </motion.div>
      </section>

      {/* ── Trending ── */}
      <section className="bg-surface-light/30 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <SectionHeader title="Trending Now" icon={Flame} linkTo="/movies" />
            <HScrollSection>
              {trending.map(movie => (
                <MovieCard key={movie.id} movie={movie} size="md" />
              ))}
              {/* Padding card */}
              {nowShowing.slice(0, 3).map(movie => (
                <MovieCard key={`t-${movie.id}`} movie={movie} size="md" />
              ))}
            </HScrollSection>
          </motion.div>
        </div>
      </section>

      {/* ── Coming Soon ── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <SectionHeader title="Coming Soon" icon={Calendar} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {comingSoon.map(movie => (
              <ComingSoonCard key={movie.id} movie={movie} />
            ))}
          </div>
        </motion.div>
      </section>


{/* ── Footer ── */}
<footer className="relative border-t border-white/8 pt-20 pb-8 overflow-hidden">
  {/* Background glow */}
  <div className="absolute top-0 left-1/4 w-96 h-64 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
  <div className="absolute top-0 right-1/4 w-64 h-48 bg-accent-blue/5 blur-3xl rounded-full pointer-events-none" />

  <div className="relative max-w-7xl mx-auto px-4">

    {/* ── Top grid ── */}
    <motion.div
      variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-14 border-b border-white/8"
    >
      {/* Brand column */}
      <div className="sm:col-span-2 lg:col-span-1">
        <Link to="/" className="inline-flex items-center gap-3 mb-5 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-shadow">
            <img src="/cine.png" alt="MovieBuff" className="w-6 h-6 object-contain" />
          </div>
          <div>
            <h2 className="text-xl font-display font-black text-white">MovieBuff</h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Enjoy the experience</p>
          </div>
        </Link>

        <p className="text-sm text-zinc-400 leading-relaxed mb-6">
          Your all-in-one destination for booking movie tickets, discovering cinemas, and enjoying exclusive deals — crafted for true cinephiles.
        </p>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { label: '500+ Cinemas', icon: '🎬' },
            { label: '50+ Cities', icon: '🌆' },
            { label: '10M+ Bookings', icon: '🎟️' },
          ].map(b => (
            <span key={b.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-zinc-400">
              <span>{b.icon}</span>{b.label}
            </span>
          ))}
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-2">
          {[
            { label: 'X', icon: '𝕏' },
            { label: 'IG', icon: '📸' },
            { label: 'YT', icon: '▶' },
            { label: 'FB', icon: 'f' },
          ].map(s => (
            <motion.button
              key={s.label}
              whileHover={{ scale: 1.12, y: -2 }}
              whileTap={{ scale: 0.95 }}
              title={s.label}
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-primary/10 hover:text-primary flex items-center justify-center text-sm text-zinc-400 transition-all"
            >
              {s.icon}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-5">Discover</h3>
        <ul className="space-y-3">
          {[
            { label: 'Now Showing', to: '/movies' },
            { label: 'Coming Soon', to: '/movies' },
            { label: 'Top Rated', to: '/movies' },
            { label: 'IMAX & 4DX', to: '/movies' },
            { label: 'Exclusive Offers', to: '/offers' },
            { label: 'My Bookings', to: '/profile/bookings' },
          ].map(({ label, to }) => (
            <li key={label}>
              <Link
                to={to}
                className="group flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <ChevronRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 -ml-1 transition-all group-hover:translate-x-0.5" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Cities */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-5">Top Cities</h3>
        <div className="flex flex-wrap gap-2">
          {cities.filter(c => c.popular).slice(0, 8).map(city => (
            <motion.button
              key={city.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { useCityStore.getState().setCity(city); navigate('/movies') }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-400 hover:border-primary/30 hover:text-white hover:bg-primary/5 transition-all"
            >
              <MapPin className="w-3 h-3 text-primary shrink-0" />
              {city.name}
            </motion.button>
          ))}
        </div>

        {/* App download pills */}
        <div className="mt-6 space-y-2">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Download App</p>
          {[
            { store: 'App Store', sub: 'iPhone & iPad', icon: '🍎' },
            { store: 'Google Play', sub: 'Android', icon: '▶' },
          ].map(a => (
            <motion.button
              key={a.store}
              whileHover={{ x: 4 }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
            >
              <span className="text-xl">{a.icon}</span>
              <div>
                <p className="text-[10px] text-zinc-500 leading-none">{a.sub}</p>
                <p className="text-sm font-semibold text-white leading-tight">{a.store}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-5">Stay Updated</h3>
        <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
          Get first-look trailers, exclusive promo codes, and new release alerts straight to your inbox.
        </p>

        <FooterNewsletter />

        {/* Promo teaser */}
        <div className="mt-5 p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3">
          <span className="text-2xl">🎟️</span>
          <div>
            <p className="text-xs font-bold text-primary">Subscribers get FIRST50</p>
            <p className="text-[10px] text-zinc-500">50% off your first booking</p>
          </div>
        </div>
      </div>
    </motion.div>

    {/* ── Bottom bar ── */}
    <motion.div
      variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
      className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
    >
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <span>© {new Date().getFullYear()} MovieBuff Inc.</span>
        <span className="w-1 h-1 rounded-full bg-zinc-600" />
        <span>All rights reserved</span>
        <span className="w-1 h-1 rounded-full bg-zinc-600" />
        <span className="flex items-center gap-1">Made with <span className="text-accent-coral">♥</span> for cinephiles</span>
      </div>

      <div className="flex items-center gap-1 flex-wrap justify-center">
        {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Help Center'].map((item, i, arr) => (
          <span key={item} className="flex items-center">
            <button className="text-xs text-zinc-500 hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-primary/5">
              {item}
            </button>
            {i < arr.length - 1 && <span className="text-zinc-700">·</span>}
          </span>
        ))}
      </div>
    </motion.div>

  </div>
</footer>

      
    </div>
  )
}
