import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, Tag, Check, CreditCard, Smartphone, Wallet,
  Shield, Lock, Clock, AlertCircle, Loader2
} from 'lucide-react'
import { cn, formatCurrency, generateBookingId, formatTime, formatDate } from '@/lib/utils'
import { useBookingStore } from '@/store'
import { promoCodes } from '@/data/mockData'

const SEAT_HOLD_DURATION = 300

// ── Step Progress ─────────────────────────────────────────────
function StepProgress({ step }: { step: number }) {
  const steps = ['Seats', 'Add-ons', 'Payment']
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((label, i) => {
        const idx = i + 1
        const done = idx < step
        const active = idx === step
        return (
          <div key={label} className="flex items-center">
            <div className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
              active ? 'bg-primary text-white shadow-glow-sm' : done ? 'text-accent-green' : 'text-zinc-500'
            )}>
              <div className={cn(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold',
                active ? 'border-white text-white' : done ? 'border-accent-green bg-accent-green text-white' : 'border-zinc-600 text-zinc-600'
              )}>
                {done ? <Check className="w-3 h-3" /> : idx}
              </div>
              <span className="hidden sm:inline">{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn('h-0.5 w-8 transition-colors', done ? 'bg-accent-green' : 'bg-white/10')} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Countdown Timer ───────────────────────────────────────────
function SeatHoldTimer({ seconds }: { seconds: number }) {
  const circ = 2 * Math.PI * 22
  const pct = seconds / 300
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-14 h-14">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="22" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
          <circle
            cx="25" cy="25" r="22" fill="none"
            stroke={seconds < 60 ? '#FF4757' : '#7C3AED'}
            strokeWidth="4" strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - pct)}
            className="transition-all"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('text-xs font-bold font-mono', seconds < 60 ? 'text-accent-coral' : 'text-white')}>
            {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
          </span>
        </div>
      </div>
      <p className="text-[10px] text-zinc-500 text-center">Seat Hold</p>
    </div>
  )
}

type PayMethod = 'card' | 'upi' | 'wallet'

export default function CheckoutPage() {
  const { showId } = useParams<{ showId: string }>()
  const navigate = useNavigate()
  const { draft, getSubtotal, getConvenienceFee, getTotal, setPromoCode, reset } = useBookingStore()

  const [payMethod, setPayMethod] = useState<PayMethod>('card')
  const [promoInput, setPromoInput] = useState('')
  const [promoStatus, setPromoStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [promoMsg, setPromoMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(SEAT_HOLD_DURATION)

  // Card form
  const [cardNum, setCardNum] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardName, setCardName] = useState('')
  const [upiId, setUpiId] = useState('')

  // Countdown — navigates back to movies when time runs out
  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(id)
          navigate('/movies')
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [navigate])

  const handleApplyPromo = () => {
    const found = promoCodes.find(p => p.code === promoInput.trim().toUpperCase())
    const subtotal = getSubtotal()
    if (!found) {
      setPromoStatus('error'); setPromoMsg('Invalid promo code'); return
    }
    if (subtotal < found.minOrder) {
      setPromoStatus('error'); setPromoMsg(`Min order ${formatCurrency(found.minOrder)} required`); return
    }
    const discount = Math.min(Math.round(subtotal * found.discount / 100), found.maxDiscount)
    setPromoCode(found.code, discount)
    setPromoStatus('success')
    setPromoMsg(`${found.discount}% off applied! You save ${formatCurrency(discount)}`)
  }

  const handlePay = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    const bookingId = generateBookingId()
    setLoading(false)
    navigate(`/booking/${bookingId}`)
  }

  const formatCard = (val: string) =>
    val.replace(/\D/g, '').substring(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const formatExpiry = (val: string) =>
    val.replace(/\D/g, '').substring(0, 4).replace(/(.{2})/, '$1/')

  const subtotal = getSubtotal()
  const fee = getConvenienceFee()
  const discount = draft.discount
  const total = getTotal()

  const movie = draft.movie
  const show = draft.show
  const cinema = draft.cinema
  const seats = draft.selectedSeats
  const fnb = draft.fnbItems

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-background/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-white/5">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <StepProgress step={3} />
            <SeatHoldTimer seconds={timeLeft} />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        {/* Order Summary */}
        <div className="glass-card p-5">
          <h2 className="font-display font-bold text-lg mb-4">Order Summary</h2>
          <div className="flex gap-4">
            {movie && (
              <img src={movie.posterUrl} alt={movie.title} className="w-16 h-24 rounded-xl object-cover shrink-0" />
            )}
            <div className="flex-1">
              <h3 className="font-semibold">{movie?.title}</h3>
              {cinema && <p className="text-xs text-zinc-500 mt-0.5">{cinema.name}</p>}
              {show && (
                <p className="text-xs text-zinc-500 mt-0.5">
                  {formatDate(show.date)} • {formatTime(show.time)} • {show.format}
                </p>
              )}
              {seats.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {seats.map(s => (
                    <span key={s.id} className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-[10px] font-mono text-primary">
                      {s.row}{s.number}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {fnb.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10 space-y-1">
              {fnb.map(f => (
                <div key={f.item.id} className="flex justify-between text-sm">
                  <span className="text-zinc-400">{f.item.name} ×{f.quantity}</span>
                  <span>{formatCurrency(f.item.price * f.quantity)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-sm">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Convenience Fee (7%)</span><span>{formatCurrency(fee)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-accent-green">
                <span>Promo ({draft.promoCode})</span><span>−{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base pt-1 border-t border-white/10">
              <span>Total</span><span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Promo Code */}
        <div className="glass-card p-5">
          <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary" /> Promo Code
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter code (e.g. FIRST50)"
              value={promoInput}
              onChange={e => { setPromoInput(e.target.value.toUpperCase()); setPromoStatus('idle') }}
              className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-primary/40 uppercase tracking-wider"
            />
            <button
              onClick={handleApplyPromo}
              disabled={!promoInput}
              className="px-5 py-2.5 bg-primary hover:bg-primary-dark rounded-xl text-sm font-medium transition-colors disabled:opacity-40"
            >
              Apply
            </button>
          </div>
          <AnimatePresence>
            {promoStatus !== 'idle' && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn('text-xs mt-2 flex items-center gap-1', promoStatus === 'success' ? 'text-accent-green' : 'text-accent-coral')}
              >
                {promoStatus === 'success' ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                {promoMsg}
              </motion.p>
            )}
          </AnimatePresence>
          <p className="text-[10px] text-zinc-600 mt-2">Try: FIRST50 · MOVIE20 · WEEKEND15</p>
        </div>

        {/* Payment Methods */}
        <div className="glass-card p-5">
          <h2 className="font-display font-bold text-lg mb-4">Payment Method</h2>
          <div className="flex gap-2 mb-5">
            {([
              { key: 'card', icon: CreditCard, label: 'Card' },
              { key: 'upi', icon: Smartphone, label: 'UPI' },
              { key: 'wallet', icon: Wallet, label: 'Wallet' },
            ] as const).map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setPayMethod(key)}
                className={cn(
                  'flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border text-sm font-medium transition-all',
                  payMethod === key
                    ? 'bg-primary/10 border-primary/40 text-primary'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {payMethod === 'card' && (
              <motion.div key="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Card Number</label>
                  <input
                    value={cardNum}
                    onChange={e => setCardNum(formatCard(e.target.value))}
                    placeholder="0000 0000 0000 0000"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-mono focus:outline-none focus:border-primary/40"
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Expiry</label>
                    <input
                      value={cardExpiry}
                      onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-mono focus:outline-none focus:border-primary/40"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">CVV</label>
                    <input
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                      placeholder="•••"
                      type="password"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-mono focus:outline-none focus:border-primary/40"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Name on Card</label>
                  <input
                    value={cardName}
                    onChange={e => setCardName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-primary/40"
                  />
                </div>
              </motion.div>
            )}
            {payMethod === 'upi' && (
              <motion.div
                key="upi"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {/* QR Card */}
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/5 to-transparent">
                  {/* Top label bar */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="flex gap-0.5">
                        <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
                        <span className="w-2 h-2 rounded-full bg-[#34A853]" />
                        <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
                        <span className="w-2 h-2 rounded-full bg-[#FBBC05]" />
                      </span>
                      <span className="text-sm font-semibold text-white">Google Pay</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-accent-green">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                      UPI Ready
                    </div>
                  </div>

                  {/* QR Code image */}
                  <div className="flex flex-col items-center px-6 py-5 gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl scale-110" />
                      <div className="relative p-3 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/20">
                        <img
                          src="/qr.png"
                          alt="Google Pay QR Code"
                          className="w-44 h-44 object-contain block"
                          draggable={false}
                        />
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-center">
                      <p className="text-2xl font-black text-white">{formatCurrency(total)}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">Scan with any UPI app to pay</p>
                    </div>

                    {/* Steps */}
                    <div className="w-full grid grid-cols-3 gap-2 text-center">
                      {[
                        { step: '1', text: 'Open any\nUPI app' },
                        { step: '2', text: 'Scan this\nQR code' },
                        { step: '3', text: 'Confirm\npayment' },
                      ].map(({ step, text }) => (
                        <div key={step} className="flex flex-col items-center gap-1.5">
                          <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-xs font-bold text-primary">
                            {step}
                          </div>
                          <p className="text-[10px] text-zinc-500 leading-tight whitespace-pre-line">{text}</p>
                        </div>
                      ))}
                    </div>

                    {/* App quick-launch pills */}
                    <div className="w-full pt-3 border-t border-white/10">
                      <p className="text-[10px] text-zinc-500 text-center mb-2.5 uppercase tracking-wider">
                        Or pay using app
                      </p>
                      <div className="flex gap-2 justify-center">
                        {[
                          { name: 'GPay', emoji: '🟡' },
                          { name: 'PhonePe', emoji: '🟣' },
                          { name: 'Paytm', emoji: '🔵' },
                          { name: 'BHIM', emoji: '🟠' },
                        ].map(({ name, emoji }) => (
                          <button
                            key={name}
                            className="flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-primary/5 transition-all"
                          >
                            <span className="text-base">{emoji}</span>
                            <span className="text-[9px] text-zinc-400">{name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom UPI ID strip */}
                  <div className="px-4 pb-4">
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10">
                      <Smartphone className="w-4 h-4 text-zinc-500 shrink-0" />
                      <span className="text-xs text-zinc-400 flex-1">Or enter UPI ID manually</span>
                      <input
                        value={upiId}
                        onChange={e => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="bg-transparent text-xs text-white placeholder:text-zinc-600 focus:outline-none w-32 text-right"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            {payMethod === 'wallet' && (
              <motion.div key="wallet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="grid grid-cols-2 gap-3">
                  {['Paytm Wallet', 'Amazon Pay', 'Mobikwik', 'FreeCharge'].map(w => (
                    <button key={w} className="py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:border-primary/30 transition-colors">
                      {w}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 text-xs text-zinc-500">
          {[
            { icon: Shield, label: 'Secure Payment' },
            { icon: Lock, label: '256-bit SSL' },
            { icon: Check, label: 'PCI DSS' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <Icon className="w-3.5 h-3.5 text-accent-green" />
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Pay Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handlePay}
          disabled={loading}
          className="w-full py-4 bg-primary hover:bg-primary-dark rounded-2xl font-bold text-lg transition-colors shadow-glow-md disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
          ) : (
            <><Lock className="w-4 h-4" /> Pay {formatCurrency(total)}</>
          )}
        </motion.button>
      </div>
    </div>
  )
}
