import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Bell,
  ChevronDown,
  MapPin,
  User,
  Ticket,
  LogOut,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCityStore, useAuthStore, useSearchStore } from '@/store'
import { cities } from '@/data/mockData'

export default function Navbar() {
  const navigate = useNavigate()
  const { selectedCity, setCity, detectLocation } = useCityStore()
  const { user, logout } = useAuthStore()
  const { setOpen: setSearchOpen } = useSearchStore()
  const [showCityModal, setShowCityModal] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [citySearch, setCitySearch] = useState('')
  const profileRef = useRef<HTMLDivElement>(null)

  // Auto-detect location on mount
  useEffect(() => {
    if (!selectedCity) {
      detectLocation()
    }
  }, [])

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredCities = cities.filter(c =>
    c.name.toLowerCase().includes(citySearch.toLowerCase())
  )

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U'

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-8xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo & City Selector */}
          <div className="flex items-center gap-4 shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="https://i.pinimgproxy.com/?url=aHR0cHM6Ly9jZG4taWNvbnMtcG5nLmZsYXRpY29uLmNvbS8yNTYvNDgzMS80ODMxMjAzLnBuZw==&ts=1779607348&sig=4d8f5baef3aec718629da8a9a0ff98e8d9a3157848f31d0eb53c714bd69afdb2"
                alt="MovieBuff"
                className="w-8 h-8 md:w-10 md:h-10"
              />
              <span className="text-xl md:text-2xl font-bold font-display gradient-text">
                MovieBuff
              </span>
            </Link>

            <button
              onClick={() => setShowCityModal(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-primary/30 transition-colors"
            >
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-zinc-200">
                  {selectedCity ? selectedCity.name : 'Select City'}
                </span>
                <span className="text-xs text-zinc-500">
                  {selectedCity ? selectedCity.name + ', ' + selectedCity.state : 'Choose a location'}
                </span>
              </div>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3">
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

            {/* Notifications */}
            <button
              className="relative p-2 rounded-full hover:bg-white/5 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-zinc-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-coral rounded-full" />
            </button>

            {/* Profile */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center text-xs font-semibold"
              >
                {initials}
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-56 rounded-xl bg-surface border border-white/10 shadow-2xl overflow-hidden"
                  >
                    <div className="p-3 border-b border-white/10">
                      <p className="font-medium text-sm">{user?.name}</p>
                      <p className="text-xs text-zinc-500">{user?.email}</p>
                    </div>
                    <div className="p-1">
                      <button
                        onClick={() => { setShowProfileMenu(false); navigate('/profile') }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4" /> Profile
                      </button>
                      <button
                        onClick={() => { setShowProfileMenu(false); navigate('/profile/bookings') }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Ticket className="w-4 h-4" /> My Bookings
                      </button>
                      <button
                        onClick={() => { logout(); setShowProfileMenu(false) }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-accent-coral hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* City Selector Modal */}
      <AnimatePresence>
        {showCityModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowCityModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-lg font-semibold font-display">Select City</h2>
                <button onClick={() => setShowCityModal(false)} className="p-1 hover:bg-white/5 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search city..."
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Popular Cities */}
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Popular Cities</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
                  {filteredCities.filter(c => c.popular).map(city => (
                    <button
                      key={city.id}
                      onClick={() => { setCity(city); setShowCityModal(false); setCitySearch('') }}
                      className={cn(
                        'px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                        selectedCity?.id === city.id
                          ? 'bg-primary text-white shadow-glow-sm'
                          : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10'
                      )}
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
