// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Movie Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface Movie {
  id: string
  title: string
  tagline: string
  synopsis: string
  posterUrl: string
  backdropUrl: string
  trailerUrl: string
  genres: string[]
  language: string
  languages: string[]
  formats: MovieFormat[]
  duration: number // in minutes
  releaseDate: string
  rating: {
    imdb: number
    rottenTomatoes: number
    userRating: number
  }
  certification: string // U, UA, A, S
  cast: CastMember[]
  director: string
  priceFrom: number
  status: 'now_showing' | 'coming_soon' | 'trending'
}

export interface CastMember {
  name: string
  role: string
  imageUrl: string
}

export type MovieFormat = '2D' | '3D' | 'IMAX' | '4DX' | 'IMAX 3D'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Cinema & Showtime Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface Cinema {
  id: string
  name: string
  address: string
  city: string
  distance: number // in km
  facilities: string[]
  shows: Show[]
}

export interface Show {
  id: string
  movieId: string
  cinemaId: string
  time: string // HH:mm
  date: string // YYYY-MM-DD
  format: MovieFormat
  language: string
  availableSeats: number
  totalSeats: number
  pricing: SeatPricing[]
}

export interface SeatPricing {
  category: SeatCategory
  price: number
  available: number
  total: number
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Seat Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

export type SeatCategory = 'RECLINER' | 'PREMIUM' | 'EXECUTIVE' | 'NORMAL'
export type SeatStatus = 'available' | 'selected' | 'occupied' | 'accessible'

export interface Seat {
  id: string
  row: string
  number: number
  category: SeatCategory
  status: SeatStatus
  price: number
}

export interface SeatLayout {
  showId: string
  sections: SeatSection[]
}

export interface SeatSection {
  category: SeatCategory
  price: number
  rows: SeatRow[]
}

export interface SeatRow {
  label: string
  seats: Seat[]
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Food & Beverage Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface FnBItem {
  id: string
  name: string
  description: string
  imageUrl: string
  category: 'combo' | 'popcorn' | 'nachos' | 'beverage' | 'snack'
  sizes?: FnBSize[]
  price: number
  calories: number
  isVeg: boolean
}

export interface FnBSize {
  label: 'S' | 'M' | 'L'
  price: number
  calories: number
}

export interface CartFnBItem {
  item: FnBItem
  quantity: number
  selectedSize?: 'S' | 'M' | 'L'
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Booking Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface Booking {
  id: string
  movieId: string
  movie: Movie
  cinemaId: string
  cinema: Cinema
  showId: string
  show: Show
  seats: Seat[]
  fnbItems: CartFnBItem[]
  subtotal: number
  convenienceFee: number
  discount: number
  total: number
  promoCode?: string
  paymentMethod: string
  status: 'confirmed' | 'cancelled' | 'expired'
  bookedAt: string
  qrCode: string
}

export interface BookingDraft {
  movieId: string | null
  movie: Movie | null
  cinemaId: string | null
  cinema: Cinema | null
  showId: string | null
  show: Show | null
  selectedSeats: Seat[]
  fnbItems: CartFnBItem[]
  promoCode: string | null
  discount: number
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// User Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  preferredCity: string
  notifications: boolean
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// City Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface City {
  id: string
  name: string
  state: string
  popular: boolean
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Promo / Offer Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface PromoCode {
  code: string
  discount: number // percentage
  maxDiscount: number
  minOrder: number
  description: string
  validUntil: string
}
