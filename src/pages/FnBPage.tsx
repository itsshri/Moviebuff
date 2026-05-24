import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ChevronRight,
  Minus,
  Plus,
  Leaf,
  Drumstick,
  UtensilsCrossed,
  Sparkles,
  ShoppingCart,
  X,
  Flame,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'
import { fnbItems } from '@/data/mockData'
import { useBookingStore } from '@/store'
import { addToast } from '@/components/common/Toast'
import type { FnBItem, FnBSize } from '@/types'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Constants
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

const CATEGORY_IMAGES: Record<string, string> = {
  combo: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/FOOD_CATALOG/IMAGES/CMS/2024/12/17/02565e2c-a75e-4327-baa3-6d8fabc82466_6d59f234-e3a8-47cc-9dce-ed85c01d60cb.jpg',
  popcorn: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/FOOD_CATALOG/IMAGES/CMS/2025/2/25/58e01d10-6b67-4e16-a2dc-b0eb9f743687_d514aa4b-0bc7-4a18-a85d-e90d8c0487be.jpg',
  nachos: 'https://dailydishrecipes.com/wp-content/uploads/2014/06/Easy-Loaded-Beef-Nachos-Featured-Image-1.jpg',
  beverage: 'https://images.unsplash.com/photo-1554866585-cd4628902d4a?w=100&h=100&fit=crop',
  snack: 'https://images.unsplash.com/photo-1599599810694-2e8d8dba5d27?w=100&h=100&fit=crop',
}

const CATEGORY_LABELS: Record<string, string> = {
  combo: 'Combo Deals',
  popcorn: 'Popcorn',
  nachos: 'Nachos & Snacks',
  beverage: 'Beverages',
  snack: 'Snacks',
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// FnB Item Card
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

interface FnBCardProps {
  item: FnBItem
  quantity: number
  selectedSize: FnBSize['label'] | undefined
  onAdd: () => void
  onRemove: () => void
  onSizeChange: (size: FnBSize['label']) => void
}

function FnBCard({ item, quantity, selectedSize, onAdd, onRemove, onSizeChange }: FnBCardProps) {
  const currentPrice = useMemo(() => {
    if (item.sizes && selectedSize) {
      return item.sizes.find((s) => s.label === selectedSize)?.price ?? item.price
    }
    return item.price
  }, [item, selectedSize])

  const currentCalories = useMemo(() => {
    if (item.sizes && selectedSize) {
      return item.sizes.find((s) => s.label === selectedSize)?.calories ?? item.calories
    }
    return item.calories
  }, [item, selectedSize])

  const imageUrl = item.imageUrl || 'https://images.unsplash.com/photo-1585238341710-4b4e6784d0e0?w=100&h=100&fit=crop'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 flex flex-col"
    >
      <div className="flex items-start gap-3">
        {/* Image icon */}
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 overflow-hidden">
          <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm">{item.name}</h3>
                {item.isVeg ? (
                  <Leaf className="w-3.5 h-3.5 text-accent-green shrink-0" />
                ) : (
                  <Drumstick className="w-3.5 h-3.5 text-accent-coral shrink-0" />
                )}
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">{item.description}</p>
            </div>
          </div>

          {/* Calories */}
          <div className="flex items-center gap-1 mt-1.5 text-[10px] text-zinc-600">
            <Flame className="w-3 h-3" />
            <span>{currentCalories} kcal</span>
          </div>

          {/* Size selector */}
          {item.sizes && item.sizes.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              {item.sizes.map((size) => (
                <button
                  key={size.label}
                  onClick={() => onSizeChange(size.label)}
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-medium border transition-all',
                    selectedSize === size.label
                      ? 'bg-primary/20 border-primary/40 text-primary-light'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                  )}
                >
                  {size.label}
                  <span className="ml-1 text-[10px] opacity-70">{formatCurrency(size.price)}</span>
                </button>
              ))}
            </div>
          )}

          {/* Price + quantity */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-base font-bold">{formatCurrency(currentPrice)}</span>

            {quantity === 0 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAdd}
                className="px-4 py-1.5 bg-primary/20 text-primary text-xs font-semibold rounded-lg border border-primary/30 hover:bg-primary/30 transition-colors"
              >
                Add
              </motion.button>
            ) : (
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onRemove}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:bg-accent-coral/20 hover:text-accent-coral hover:border-accent-coral/30 transition-colors"
                >
                  {quantity === 1 ? <X className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                </motion.button>
                <span className="w-6 text-center font-bold text-sm">{quantity}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onAdd}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main Page
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function FnBPage() {
  const { showId } = useParams<{ showId: string }>()
  const navigate = useNavigate()
  const { draft, addFnbItem, updateFnbQuantity, removeFnbItem } = useBookingStore()

  // Track selected sizes locally (keyed by item id)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, FnBSize['label']>>(() => {
    const initial: Record<string, FnBSize['label']> = {}
    fnbItems.forEach((item) => {
      if (item.sizes && item.sizes.length > 0) {
        // Check if already in cart
        const cartItem = draft.fnbItems.find((f) => f.item.id === item.id)
        initial[item.id] = cartItem?.selectedSize ?? 'M'
      }
    })
    return initial
  })

  // Group items by category
  const grouped = useMemo(() => {
    const map = new Map<string, FnBItem[]>()
    const order = ['combo', 'popcorn', 'nachos', 'beverage', 'snack']
    order.forEach((cat) => map.set(cat, []))
    fnbItems.forEach((item) => {
      const list = map.get(item.category) ?? []
      list.push(item)
      map.set(item.category, list)
    })
    return Array.from(map.entries()).filter(([, items]) => items.length > 0)
  }, [])

  // Get quantity from cart
  const getQuantity = (itemId: string): number => {
    const cartItem = draft.fnbItems.find((f) => f.item.id === itemId)
    return cartItem?.quantity ?? 0
  }

  // Get FnB total
  const fnbTotal = useMemo(() => {
    return draft.fnbItems.reduce((sum, f) => {
      const price = f.selectedSize
        ? f.item.sizes?.find((s) => s.label === f.selectedSize)?.price ?? f.item.price
        : f.item.price
      return sum + price * f.quantity
    }, 0)
  }, [draft.fnbItems])

  const totalItems = draft.fnbItems.reduce((sum, f) => sum + f.quantity, 0)

  // Handlers
  const handleAdd = (item: FnBItem) => {
    const size = selectedSizes[item.id]
    addFnbItem({
      item,
      quantity: 1,
      selectedSize: size,
    })
    addToast(`Added ${item.name} to cart`, 'success')
  }

  const handleRemove = (item: FnBItem) => {
    const cartItem = draft.fnbItems.find((f) => f.item.id === item.id)
    if (!cartItem) return
    if (cartItem.quantity <= 1) {
      removeFnbItem(item.id)
    } else {
      updateFnbQuantity(item.id, cartItem.quantity - 1)
    }
  }

  const handleSizeChange = (itemId: string, size: FnBSize['label']) => {
    setSelectedSizes((prev) => ({ ...prev, [itemId]: size }))
    // Update cart if item is already in it
    const cartItem = draft.fnbItems.find((f) => f.item.id === itemId)
    if (cartItem) {
      // Remove old and re-add with new size
      removeFnbItem(itemId)
      const item = fnbItems.find((f) => f.id === itemId)
      if (item) {
        addFnbItem({
          item,
          quantity: cartItem.quantity,
          selectedSize: size,
        })
      }
    }
  }

  return (
    <div className="min-h-screen pb-32">
      {/* ── Top Bar ── */}
      <div className="sticky top-16 z-30 bg-background/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-display font-bold text-lg flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-accent-amber" />
              Grab a Bite
            </h1>
            <p className="text-xs text-zinc-500">Add food & beverages to your movie experience</p>
          </div>
        </div>
      </div>

      {/* ── Items by Category ── */}
      <div className="max-w-3xl mx-auto px-4 pt-6 space-y-8">
        {grouped.map(([category, items], catIdx) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIdx * 0.1 }}
          >
            {/* Category Header */}
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-display font-bold">
                {CATEGORY_LABELS[category] || category}
              </h2>
              {category === 'combo' && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-amber/10 border border-accent-amber/20 text-accent-amber text-[10px] font-semibold">
                  <Sparkles className="w-3 h-3" />
                  BEST VALUE
                </span>
              )}
            </div>

            {/* Item Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.map((item) => (
                <FnBCard
                  key={item.id}
                  item={item}
                  quantity={getQuantity(item.id)}
                  selectedSize={selectedSizes[item.id]}
                  onAdd={() => handleAdd(item)}
                  onRemove={() => handleRemove(item)}
                  onSizeChange={(size) => handleSizeChange(item.id, size)}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Bottom Sticky Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-surface/95 backdrop-blur-xl border-t border-white/10 shadow-2xl">
          <div className="max-w-3xl mx-auto px-4 py-3 md:py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left — Cart summary */}
              <div className="flex-1 min-w-0">
                {totalItems > 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <ShoppingCart className="w-5 h-5 text-accent-amber" />
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent-coral text-[9px] font-bold rounded-full flex items-center justify-center">
                        {totalItems}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {totalItems} item{totalItems > 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {formatCurrency(fnbTotal)} added
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500">No items added yet</p>
                )}
              </div>

              {/* Right — Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/book/${showId}/checkout`)}
                  className="px-4 py-2.5 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Skip
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/book/${showId}/checkout`)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark rounded-xl font-medium text-sm transition-colors shadow-glow-sm"
                >
                  {totalItems > 0 ? (
                    <>
                      Continue
                      <span className="text-xs opacity-70">{formatCurrency(fnbTotal)}</span>
                    </>
                  ) : (
                    'Continue'
                  )}
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
