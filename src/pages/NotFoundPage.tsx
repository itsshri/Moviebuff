import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Film } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Decorative blobs */}
      <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-accent-blue/10 blur-3xl animate-float" style={{ animationDelay: '-3s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center"
      >
        {/* Animated film reel */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="w-24 h-24 mx-auto mb-8 opacity-20"
        >
          <Film className="w-full h-full text-primary" />
        </motion.div>

        <h1
          className="text-[8rem] md:text-[12rem] font-display font-black leading-none gradient-text"
          style={{ lineHeight: 1 }}
        >
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-display font-bold mt-4 mb-3">
          Scene Not Found
        </h2>
        <p className="text-zinc-500 max-w-sm mx-auto mb-8">
          The page you're looking for has been cut from the final edit. Let's get you back to the main feature.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark rounded-xl font-semibold transition-colors shadow-glow-sm"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>
          <Link
            to="/movies"
            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:border-primary/30 rounded-xl font-medium transition-all"
          >
            <Film className="w-4 h-4" /> Browse Movies
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
