import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star, Clock, Filter, Grid3X3, List, ChevronDown, X, Search
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { movies } from '@/data/mockData'
import type { Movie, MovieFormat } from '@/types'

const ALL_GENRES = ['Action', 'Drama', 'Thriller', 'Sci-Fi', 'Comedy', 'Horror', 'Biography', 'Adventure', 'Mythology', 'Crime']
const ALL_LANGUAGES = ['Hindi', 'English', 'Telugu', 'Tamil', 'Malayalam', 'Kannada']
const ALL_FORMATS: MovieFormat[] = ['2D', '3D', 'IMAX', '4DX', 'IMAX 3D']

type SortKey = 'popularity' | 'releaseDate' | 'rating' | 'price'
type ViewMode = 'grid' | 'list'

function MovieGridCard({ movie }: { movie: Movie }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const navigate = useNavigate()
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/movies/${movie.id}`)}
      className="glass-card-hover overflow-hidden cursor-pointer"
    >
      <div className="relative aspect-[2/3] bg-surface">
        {!imgLoaded && <div className="absolute inset-0 shimmer" />}
        <img
          src={movie.posterUrl} alt={movie.title}
          onLoad={() => setImgLoaded(true)}
          className={cn('w-full h-full object-cover transition-opacity', imgLoaded ? 'opacity-100' : 'opacity-0')}
          loading="lazy"
        />
        {movie.rating.imdb > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-accent-amber/90 rounded-full">
            <Star className="w-2.5 h-2.5 text-black fill-black" />
            <span className="text-[10px] font-bold text-black">{movie.rating.imdb}</span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold border border-white/20 text-white/70">
            {movie.certification}
          </span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm truncate">{movie.title}</h3>
        <p className="text-xs text-zinc-500 mt-0.5 truncate">{movie.genres.slice(0, 2).join(' • ')}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex gap-1 flex-wrap">
            {movie.formats.slice(0, 2).map(f => (
              <span key={f} className="px-1.5 py-0.5 text-[8px] rounded bg-primary/10 border border-primary/20 text-primary font-medium">
                {f}
              </span>
            ))}
          </div>
          <span className="text-xs text-zinc-400">from {formatCurrency(movie.priceFrom)}</span>
        </div>
        <button
          onClick={e => { e.stopPropagation(); navigate(`/movies/${movie.id}`); }}
          className="mt-2 w-full py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 rounded-lg text-xs font-medium transition-all"
        >
          Book Now
        </button>
      </div>
    </motion.div>
  )
}

function MovieListCard({ movie }: { movie: Movie }) {
  const navigate = useNavigate()
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      onClick={() => navigate(`/movies/${movie.id}`)}
      className="glass-card-hover p-4 flex gap-4 cursor-pointer"
    >
      <img src={movie.posterUrl} alt={movie.title} className="w-16 h-24 object-cover rounded-xl shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold">{movie.title}</h3>
          {movie.rating.imdb > 0 && (
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3 h-3 text-accent-amber fill-accent-amber" />
              <span className="text-sm font-bold">{movie.rating.imdb}</span>
            </div>
          )}
        </div>
        <p className="text-xs text-zinc-500 mt-1">{movie.genres.join(' • ')}</p>
        <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
          <span>{movie.language}</span>
          <span className="px-1.5 py-0.5 rounded border border-white/20 text-[9px]">{movie.certification}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          {movie.formats.map(f => (
            <span key={f} className="px-2 py-0.5 text-[9px] rounded bg-primary/10 border border-primary/20 text-primary font-medium">
              {f}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-end justify-between shrink-0">
        <span className="text-sm font-bold">{formatCurrency(movie.priceFrom)}</span>
        <button onClick={e => { e.stopPropagation(); navigate(`/movies/${movie.id}`); }} className="px-4 py-1.5 bg-primary hover:bg-primary-dark rounded-lg text-xs font-semibold transition-colors">
          Book
        </button>
      </div>
    </motion.div>
  )
}

export default function MoviesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortKey>('popularity')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [selectedFormats, setSelectedFormats] = useState<MovieFormat[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [search, setSearch] = useState('')

  const toggleGenre = (g: string) =>
    setSelectedGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])
  const toggleLanguage = (l: string) =>
    setSelectedLanguages(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l])
  const toggleFormat = (f: MovieFormat) =>
    setSelectedFormats(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])

  const filtered = movies
    .filter(m => {
      if (search && !m.title.toLowerCase().includes(search.toLowerCase())) return false
      if (selectedGenres.length > 0 && !selectedGenres.some(g => m.genres.includes(g))) return false
      if (selectedLanguages.length > 0 && !selectedLanguages.includes(m.language)) return false
      if (selectedFormats.length > 0 && !selectedFormats.some(f => m.formats.includes(f))) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating': return b.rating.imdb - a.rating.imdb
        case 'price': return a.priceFrom - b.priceFrom
        case 'releaseDate': return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        default: return 0
      }
    })

  const activeFilterCount = selectedGenres.length + selectedLanguages.length + selectedFormats.length

  const clearFilters = () => {
    setSelectedGenres([])
    setSelectedLanguages([])
    setSelectedFormats([])
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-background/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search movies..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>

            {/* Sort */}
            <div className="relative hidden sm:block">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortKey)}
                className="appearance-none pl-3 pr-8 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-primary/40 text-zinc-300 cursor-pointer"
              >
                <option value="popularity">Popularity</option>
                <option value="releaseDate">Release Date</option>
                <option value="rating">Rating</option>
                <option value="price">Price</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm transition-all',
                showFilters || activeFilterCount > 0
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'bg-white/5 border-white/10 text-zinc-300 hover:border-primary/20'
              )}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* View toggle */}
            <div className="flex rounded-xl border border-white/10 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={cn('p-2 transition-colors', viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white/5 text-zinc-400 hover:bg-white/10')}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn('p-2 transition-colors', viewMode === 'list' ? 'bg-primary text-white' : 'bg-white/5 text-zinc-400 hover:bg-white/10')}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 pb-2 space-y-3">
                  {/* Genre chips */}
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2 font-medium">Genres</p>
                    <div className="flex flex-wrap gap-1.5">
                      {ALL_GENRES.map(g => (
                        <button
                          key={g}
                          onClick={() => toggleGenre(g)}
                          className={cn(
                            'px-3 py-1 rounded-full text-xs font-medium transition-all border',
                            selectedGenres.includes(g)
                              ? 'bg-primary border-primary text-white'
                              : 'bg-white/5 border-white/10 text-zinc-400 hover:border-primary/30'
                          )}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Language */}
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2 font-medium">Languages</p>
                    <div className="flex flex-wrap gap-1.5">
                      {ALL_LANGUAGES.map(l => (
                        <button
                          key={l}
                          onClick={() => toggleLanguage(l)}
                          className={cn(
                            'px-3 py-1 rounded-full text-xs font-medium transition-all border',
                            selectedLanguages.includes(l)
                              ? 'bg-accent-blue border-accent-blue text-white'
                              : 'bg-white/5 border-white/10 text-zinc-400 hover:border-accent-blue/30'
                          )}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Format */}
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2 font-medium">Format</p>
                    <div className="flex flex-wrap gap-1.5">
                      {ALL_FORMATS.map(f => (
                        <button
                          key={f}
                          onClick={() => toggleFormat(f)}
                          className={cn(
                            'px-3 py-1 rounded-full text-xs font-medium transition-all border',
                            selectedFormats.includes(f)
                              ? 'bg-accent-coral border-accent-coral text-white'
                              : 'bg-white/5 border-white/10 text-zinc-400 hover:border-accent-coral/30'
                          )}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="text-xs text-accent-coral flex items-center gap-1 hover:underline">
                      <X className="w-3 h-3" /> Clear all filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-zinc-400 text-sm">
            <span className="text-white font-semibold">{filtered.length}</span> movies found
          </p>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              {filtered.map(movie => <MovieGridCard key={movie.id} movie={movie} />)}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {filtered.map(movie => <MovieListCard key={movie.id} movie={movie} />)}
            </motion.div>
          )}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-400">No movies match your filters.</p>
            <button onClick={clearFilters} className="text-primary text-sm mt-2 hover:underline">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
