import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  Play, Star, Clock, MapPin, ChevronRight, ChevronLeft, Search, Flame, Calendar, Tag, Copy, Check as CheckIcon
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

// ── Movie Card Component ──────────────────────────────────────
function MovieCard({ movie, size = 'md' }: { movie: Movie; size?: 'lg' | 'md' | 'sm' }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const navigate = useNavigate()

  const dims = {
    lg: 'w-52 md:w-64',
    md: 'w-40 md:w-48',
    sm: 'w-32 md:w-36',
  }[size]

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      onClick={() => navigate(`/movies/${movie.id}`)}
      className={cn('shrink-0 cursor-pointer group', dims)}
    >
      <div className="relative rounded-2xl overflow-hidden aspect-[2/3] bg-surface">
        {!imgLoaded && <div className="absolute inset-0 shimmer" />}
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className={cn('w-full h-full object-cover transition-opacity duration-500', imgLoaded ? 'opacity-100' : 'opacity-0')}
          onLoad={() => setImgLoaded(true)}
          loading="lazy"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {/* IMDB badge */}
        {movie.rating.imdb > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-accent-amber/90 rounded-full">
            <Star className="w-2.5 h-2.5 text-black fill-black" />
            <span className="text-[10px] font-bold text-black">{movie.rating.imdb}</span>
          </div>
        )}
        {/* Book Now on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="w-full py-2 bg-primary rounded-xl text-xs font-semibold">
            Book Now • {formatCurrency(movie.priceFrom)}
          </button>
        </div>
      </div>
      <div className="mt-2.5 px-1">
        <h3 className="text-sm font-semibold truncate">{movie.title}</h3>
        <div className="flex flex-wrap gap-1 mt-1">
          {movie.genres.slice(0, 2).map(g => (
            <span key={g} className="px-1.5 py-0.5 text-[9px] bg-white/5 border border-white/10 rounded-full text-zinc-400">
              {g}
            </span>
          ))}
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
              className="text-5xl sm:text-6xl md:text-8xl font-display font-black leading-none mb-6"
            >
              <GradientText>Movie</GradientText>
              <span className="text-white">Buff</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {comingSoon.map((movie) => (
              <motion.div
                key={movie.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                onClick={() => navigate(`/movies/${movie.id}`)}
                className="glass-card-hover p-4 flex gap-4 cursor-pointer overflow-hidden"
              >
                <div className="w-20 h-28 rounded-xl overflow-hidden shrink-0">
                  <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-base truncate">{movie.title}</h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    {movie.genres.slice(0, 2).join(' • ')}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Calendar className="w-3.5 h-3.5 text-accent-blue" />
                    <span className="text-xs text-zinc-400">{movie.releaseDate}</span>
                  </div>
                  <div className="mt-3">
                    <Countdown targetDate={movie.releaseDate} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {movie.formats.map(f => (
                      <span key={f} className="px-2 py-0.5 text-[9px] rounded bg-accent-blue/10 border border-accent-blue/20 text-accent-blue font-medium">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>


{/* ── Footer Section ── */}
<footer className="bg-surface-light/30 border-t border-white/10 pt-16 pb-8">
  <div className="max-w-7xl mx-auto px-4">
    
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
    >

      {/* Brand */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-glow-sm">
            <Flame className="w-5 h-5 text-primary" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              MovieBuff
            </h2>
            <p className="text-xs text-zinc-400">
              Premium Movie Experience
            </p>
          </div>
        </div>

        <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
          Book movie tickets instantly, explore trending films,
          discover nearby theatres, and enjoy a next-generation
          entertainment experience.
        </p>

        <div className="flex items-center gap-3 mt-6">
          {[
            Search, Flame, Calendar, Star
          ].map((Icon, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 hover:border-primary/40 hover:text-primary transition-all"
            >
              <Icon className="w-4 h-4" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Explore */}
      <div>
        <h3 className="text-white font-semibold mb-5 text-lg">
          Explore
        </h3>

        <div className="flex flex-col gap-3">
          {[
            'Now Showing',
            'Coming Soon',
            'Top Rated',
            'IMAX Experience',
            'Offers & Deals',
          ].map((item) => (
            <button
              key={item}
              className="text-left text-sm text-zinc-400 hover:text-primary transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Top Cities */}
      <div>
        <h3 className="text-white font-semibold mb-5 text-lg">
          Top Cities
        </h3>

        <div className="flex flex-wrap gap-3">
          {cities
            .filter((c) => c.popular)
            .slice(0, 6)
            .map((city) => (
              <motion.button
                key={city.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-zinc-300 hover:border-primary/30 hover:text-primary transition-all"
              >
                {city.name}
              </motion.button>
            ))}
        </div>
      </div>

      {/* Newsletter */}
      <div>
        <h3 className="text-white font-semibold mb-5 text-lg">
          Stay Updated
        </h3>

        <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
          Get updates on latest movie releases, exclusive offers,
          and trending entertainment news.
        </p>

        <div className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-primary/50 transition-all"
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-12 rounded-xl bg-primary text-white font-medium shadow-glow-sm hover:opacity-90 transition-all"
          >
            Subscribe
          </motion.button>
        </div>
      </div>
    </motion.div>

    {/* Bottom Bar */}
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="border-t border-white/10 mt-14 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
    >
      <p className="text-sm text-zinc-500 text-center md:text-left">
        © 2026 CineVerse. All rights reserved.
      </p>

      <div className="flex items-center gap-6">
        {[
          'Privacy Policy',
          'Terms of Service',
          'Support',
        ].map((item) => (
          <button
            key={item}
            className="text-sm text-zinc-500 hover:text-primary transition-colors"
          >
            {item}
          </button>
        ))}
      </div>
    </motion.div>
  </div>
</footer>

      
    </div>
  )
}
