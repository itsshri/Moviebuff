import { create } from 'zustand'
import type { BookingDraft, CartFnBItem, City, Seat, User, Movie, Cinema, Show } from '@/types'
import { mockUser, cities } from '@/data/mockData'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// City Store
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

interface CityState {
  selectedCity: City | null
  setCity: (city: City) => void
  detecting: boolean
  detectLocation: () => Promise<void>
}

// City coordinates for approximate matching
const cityCoordinates: { [key: string]: { lat: number; lon: number } } = {
  'blr': { lat: 12.9716, lon: 77.5946 }, // Bengaluru
  'hyd': { lat: 17.3850, lon: 78.4867 }, // Hyderabad
  'chn': { lat: 13.0827, lon: 80.2707 }, // Chennai
  'cbe': { lat: 11.0026, lon: 76.9655 }, // Coimbatore
}

// Calculate distance between two coordinates
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export const useCityStore = create<CityState>((set, get) => ({
  selectedCity: null,
  detecting: false,
  setCity: (city) => set({ selectedCity: city }),
  detectLocation: async () => {
    set({ detecting: true })
    try {
      if (!('geolocation' in navigator)) {
        console.log('Geolocation not available')
        set({ detecting: false })
        return
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          enableHighAccuracy: false,
        })
      })

      const { latitude, longitude } = position.coords

      // Find nearest city
      let nearestCity: City | null = null
      let minDistance = Infinity

      cities.forEach((city) => {
        const coords = cityCoordinates[city.id]
        if (coords) {
          const distance = calculateDistance(latitude, longitude, coords.lat, coords.lon)
          if (distance < minDistance) {
            minDistance = distance
            nearestCity = city
          }
        }
      })

      if (nearestCity && minDistance < 100) {
        // Only set if within 100km
        set({ selectedCity: nearestCity, detecting: false })
      } else {
        set({ detecting: false })
      }
    } catch (error) {
      console.log('Location detection failed:', error)
      set({ detecting: false })
    }
  },
}))

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Auth Store
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: mockUser,
  isAuthenticated: true,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  updateUser: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null,
  })),
}))

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Booking Store
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

interface BookingState {
  draft: BookingDraft
  setMovie: (movie: Movie) => void
  setCinema: (cinema: Cinema) => void
  setShow: (show: Show) => void
  addSeat: (seat: Seat) => void
  removeSeat: (seatId: string) => void
  clearSeats: () => void
  addFnbItem: (item: CartFnBItem) => void
  removeFnbItem: (itemId: string) => void
  updateFnbQuantity: (itemId: string, quantity: number) => void
  setPromoCode: (code: string | null, discount: number) => void
  getSubtotal: () => number
  getConvenienceFee: () => number
  getTotal: () => number
  reset: () => void
}

const initialDraft: BookingDraft = {
  movieId: null,
  movie: null,
  cinemaId: null,
  cinema: null,
  showId: null,
  show: null,
  selectedSeats: [],
  fnbItems: [],
  promoCode: null,
  discount: 0,
}

export const useBookingStore = create<BookingState>((set, get) => ({
  draft: { ...initialDraft },

  setMovie: (movie) => set((state) => ({
    draft: { ...state.draft, movieId: movie.id, movie },
  })),

  setCinema: (cinema) => set((state) => ({
    draft: { ...state.draft, cinemaId: cinema.id, cinema },
  })),

  setShow: (show) => set((state) => ({
    draft: { ...state.draft, showId: show.id, show },
  })),

  addSeat: (seat) => set((state) => {
    if (state.draft.selectedSeats.length >= 10) return state
    if (state.draft.selectedSeats.find(s => s.id === seat.id)) return state
    return {
      draft: {
        ...state.draft,
        selectedSeats: [...state.draft.selectedSeats, seat],
      },
    }
  }),

  removeSeat: (seatId) => set((state) => ({
    draft: {
      ...state.draft,
      selectedSeats: state.draft.selectedSeats.filter(s => s.id !== seatId),
    },
  })),

  clearSeats: () => set((state) => ({
    draft: { ...state.draft, selectedSeats: [] },
  })),

  addFnbItem: (item) => set((state) => {
    const existing = state.draft.fnbItems.find(
      f => f.item.id === item.item.id && f.selectedSize === item.selectedSize
    )
    if (existing) {
      return {
        draft: {
          ...state.draft,
          fnbItems: state.draft.fnbItems.map(f =>
            f.item.id === item.item.id && f.selectedSize === item.selectedSize
              ? { ...f, quantity: f.quantity + item.quantity }
              : f
          ),
        },
      }
    }
    return {
      draft: {
        ...state.draft,
        fnbItems: [...state.draft.fnbItems, item],
      },
    }
  }),

  removeFnbItem: (itemId) => set((state) => ({
    draft: {
      ...state.draft,
      fnbItems: state.draft.fnbItems.filter(f => f.item.id !== itemId),
    },
  })),

  updateFnbQuantity: (itemId, quantity) => set((state) => ({
    draft: {
      ...state.draft,
      fnbItems: quantity <= 0
        ? state.draft.fnbItems.filter(f => f.item.id !== itemId)
        : state.draft.fnbItems.map(f =>
            f.item.id === itemId ? { ...f, quantity } : f
          ),
    },
  })),

  setPromoCode: (code, discount) => set((state) => ({
    draft: { ...state.draft, promoCode: code, discount },
  })),

  getSubtotal: () => {
    const state = get()
    const seatTotal = state.draft.selectedSeats.reduce((sum, s) => sum + s.price, 0)
    const fnbTotal = state.draft.fnbItems.reduce((sum, f) => {
      const price = f.selectedSize
        ? f.item.sizes?.find(s => s.label === f.selectedSize)?.price ?? f.item.price
        : f.item.price
      return sum + price * f.quantity
    }, 0)
    return seatTotal + fnbTotal
  },

  getConvenienceFee: () => {
    const subtotal = get().getSubtotal()
    return Math.round(subtotal * 0.07) // 7% convenience fee
  },

  getTotal: () => {
    const subtotal = get().getSubtotal()
    const fee = get().getConvenienceFee()
    const discount = get().draft.discount
    return subtotal + fee - discount
  },

  reset: () => set({ draft: { ...initialDraft } }),
}))

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// User Bookings Store
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

interface UserBookingsState {
  bookings: Booking[]
  addBooking: (booking: Booking) => void
  cancelBooking: (bookingId: string) => void
  loadBookings: (bookings: Booking[]) => void
}

export const useUserBookingsStore = create<UserBookingsState>((set) => ({
  bookings: [],
  addBooking: (booking) => set((state) => ({
    bookings: [booking, ...state.bookings],
  })),
  cancelBooking: (bookingId) => set((state) => ({
    bookings: state.bookings.map(b =>
      b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
    ),
  })),
  loadBookings: (bookings) => set({ bookings }),
}))

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Search Store
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SearchState {
  isOpen: boolean
  query: string
  setOpen: (open: boolean) => void
  setQuery: (query: string) => void
}

export const useSearchStore = create<SearchState>((set) => ({
  isOpen: false,
  query: '',
  setOpen: (isOpen) => set({ isOpen }),
  setQuery: (query) => set({ query }),
}))
