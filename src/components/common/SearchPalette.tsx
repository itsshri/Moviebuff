import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Film, X, ArrowRight } from 'lucide-react'
import { useSearchStore } from '@/store'
import { movies } from '@/data/mockData'

export default function SearchPalette() {
  const navigate = useNavigate()
  const { isOpen, query, setOpen, setQuery } = useSearchStore()
  const inputRef = useRef<HTMLInputElement>(null)

  // Cmd+K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(!isOpen)
      }
      if (e.key === 'Escape' && isOpen) {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, setOpen])

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
    }
  }, [isOpen, setQuery])

  const results = query.length > 0
    ? movies.filter(m => m.title.toLowerCase().includes(query.toLowerCase()))
    : []

  const handleSelect = (movieId: string) => {
    setOpen(false)
    setQuery('')
    navigate(`/movies/${movieId}`)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl mx-4 bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <Search className="w-5 h-5 text-zinc-500 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search movies, cinemas..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder:text-zinc-500 focus:outline-none text-sm"
              />
              <div className="hidden sm:flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-[10px] bg-white/5 border border-white/10 rounded text-zinc-500">
                  ESC
                </kbd>
              </div>
              <button onClick={() => setOpen(false)} className="sm:hidden p-1">
                <X className="w-4 h-4 text-zinc-500" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto">
              {query.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 text-sm">
                  <p>Start typing to search movies...</p>
                  <p className="mt-1 text-xs">
                    <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded text-[10px]">⌘K</kbd>
                    {' '}to toggle search
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 text-sm">
                  No results for &quot;{query}&quot;
                </div>
              ) : (
                <div className="p-2">
                  <p className="px-3 py-1 text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                    Movies
                  </p>
                  {results.map(movie => (
                    <button
                      key={movie.id}
                      onClick={() => handleSelect(movie.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left group"
                    >
                      <div className="w-10 h-14 rounded-lg overflow-hidden bg-white/5 shrink-0">
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{movie.title}</p>
                        <p className="text-xs text-zinc-500 flex items-center gap-2">
                          <Film className="w-3 h-3" />
                          {movie.genres.slice(0, 2).join(' • ')} • {movie.language}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
