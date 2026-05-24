import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from '@/components/common/Navbar'
import MobileNav from '@/components/common/MobileNav'
import SearchPalette from '@/components/common/SearchPalette'
import { ToastContainer } from '@/components/common/Toast'

const HomePage = lazy(() => import('@/pages/HomePage'))
const MoviesPage = lazy(() => import('@/pages/MoviesPage'))
const MovieDetailPage = lazy(() => import('@/pages/MovieDetailPage'))
const SeatSelectionPage = lazy(() => import('@/pages/SeatSelectionPage'))
const FnBPage = lazy(() => import('@/pages/FnBPage'))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'))
const BookingConfirmationPage = lazy(() => import('@/pages/BookingConfirmationPage'))
const MyBookingsPage = lazy(() => import('@/pages/MyBookingsPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const OffersPage = lazy(() => import('@/pages/OffersPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-zinc-500 text-sm animate-pulse">Loading...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-background text-white">
      <Navbar />
      <SearchPalette />

      {/* Main content — push below fixed navbar */}
      <main className="pt-16 pb-20 md:pb-0">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/movies/:id" element={<MovieDetailPage />} />
            <Route path="/book/:showId" element={<SeatSelectionPage />} />
            <Route path="/book/:showId/fnb" element={<FnBPage />} />
            <Route path="/book/:showId/checkout" element={<CheckoutPage />} />
            <Route path="/booking/:bookingId" element={<BookingConfirmationPage />} />
            <Route path="/profile/bookings" element={<MyBookingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <MobileNav />
      <ToastContainer />
    </div>
  )
}
