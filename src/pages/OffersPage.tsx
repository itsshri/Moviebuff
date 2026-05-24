import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Tag, Sparkles } from 'lucide-react'
import { promoCodes } from '@/data/mockData'

export default function OffersPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-5 h-5 text-primary" />
            <h1 className="text-3xl font-display font-black">Offers & Deals</h1>
          </div>
          <p className="text-zinc-500 text-sm mb-8">Exclusive discounts for your movie experience</p>

          <div className="space-y-4">
            {promoCodes.map(promo => (
              <motion.div
                key={promo.code}
                whileHover={{ y: -2 }}
                className="glass-card-hover p-5 relative overflow-hidden"
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-x-4 -translate-y-8" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-accent-amber" />
                        <span className="font-mono font-black text-xl text-primary tracking-wider">{promo.code}</span>
                      </div>
                      <p className="font-semibold">{promo.description}</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Min order ₹{promo.minOrder} • Max discount ₹{promo.maxDiscount}
                      </p>
                      <p className="text-[10px] text-zinc-600 mt-1">Valid until {promo.validUntil}</p>
                    </div>
                    <div className="text-center shrink-0">
                      <div className="text-3xl font-black gradient-text">{promo.discount}%</div>
                      <div className="text-[10px] text-zinc-500">OFF</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-dashed border-white/10 flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Use at checkout</span>
                    <Link to="/movies" className="px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold rounded-lg hover:bg-primary/20 transition-colors">
                      Book Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
