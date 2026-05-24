import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, Bell, Pencil, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store'
import { mockBookings } from '@/data/mockData'
import { formatCurrency, formatDate } from '@/lib/utils'

function EditableField({
  label, value, icon: Icon, onSave
}: { label: string; value: string; icon: React.ElementType; onSave: (v: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const handleSave = () => { onSave(draft); setEditing(false) }
  const handleCancel = () => { setDraft(value); setEditing(false) }

  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{label}</p>
        {editing ? (
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel() }}
            className="w-full bg-transparent text-sm font-medium border-b border-primary/40 focus:outline-none py-0.5"
          />
        ) : (
          <p className="text-sm font-medium truncate">{value}</p>
        )}
      </div>
      {editing ? (
        <div className="flex gap-1 shrink-0">
          <button onClick={handleSave} className="p-1.5 rounded-lg bg-accent-green/10 border border-accent-green/20 text-accent-green hover:bg-accent-green/20 transition-colors">
            <Check className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleCancel} className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors shrink-0">
          <Pencil className="w-3.5 h-3.5 text-zinc-500" />
        </button>
      )}
    </div>
  )
}

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [notif, setNotif] = useState(user?.notifications ?? true)

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-zinc-400">Please log in</p>
    </div>
  )

  const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        {/* Avatar Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 text-center"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center mx-auto mb-4 text-3xl font-black font-display shadow-glow-md">
            {initials}
          </div>
          <h1 className="text-2xl font-display font-bold">{user.name}</h1>
          <p className="text-zinc-500 text-sm mt-1">Member since 2024</p>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="text-center">
              <p className="text-xl font-bold">{mockBookings.length}</p>
              <p className="text-xs text-zinc-500">Bookings</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-xl font-bold">{formatCurrency(mockBookings.reduce((s, b) => s + b.total, 0))}</p>
              <p className="text-xs text-zinc-500">Total Spent</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-xl font-bold">🌟</p>
              <p className="text-xs text-zinc-500">Cinephile</p>
            </div>
          </div>
        </motion.div>

        {/* Personal Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5"
        >
          <h2 className="font-display font-bold mb-4 text-lg">Personal Information</h2>
          <div className="space-y-4">
            <EditableField
              label="Full Name" value={user.name} icon={User}
              onSave={v => updateUser({ name: v })}
            />
            <div className="h-px bg-white/5" />
            <EditableField
              label="Email" value={user.email} icon={Mail}
              onSave={v => updateUser({ email: v })}
            />
            <div className="h-px bg-white/5" />
            <EditableField
              label="Phone" value={user.phone} icon={Phone}
              onSave={v => updateUser({ phone: v })}
            />
            <div className="h-px bg-white/5" />
            <EditableField
              label="Preferred City" value={user.preferredCity} icon={MapPin}
              onSave={v => updateUser({ preferredCity: v })}
            />
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-5"
        >
          <h2 className="font-display font-bold mb-4 text-lg">Preferences</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Bell className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Push Notifications</p>
                <p className="text-xs text-zinc-500">Get alerts for new releases & offers</p>
              </div>
            </div>
            <button
              onClick={() => { setNotif(!notif); updateUser({ notifications: !notif }) }}
              className={cn(
                'w-12 h-6 rounded-full relative transition-colors duration-300',
                notif ? 'bg-primary' : 'bg-white/10'
              )}
            >
              <motion.div
                animate={{ x: notif ? 24 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
              />
            </button>
          </div>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5"
        >
          <h2 className="font-display font-bold mb-4 text-lg">Transaction History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="pb-2 text-xs text-zinc-500 font-medium">Movie</th>
                  <th className="pb-2 text-xs text-zinc-500 font-medium">Date</th>
                  <th className="pb-2 text-xs text-zinc-500 font-medium text-right">Amount</th>
                  <th className="pb-2 text-xs text-zinc-500 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockBookings.map(b => (
                  <tr key={b.id} className="hover:bg-white/2">
                    <td className="py-2.5 truncate max-w-[140px]">{b.movie.title}</td>
                    <td className="py-2.5 text-zinc-500 text-xs">{formatDate(b.bookedAt)}</td>
                    <td className="py-2.5 text-right font-medium">{formatCurrency(b.total)}</td>
                    <td className="py-2.5 text-right">
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-[10px] font-medium border',
                        b.status === 'confirmed' ? 'text-accent-green bg-accent-green/10 border-accent-green/20' : 'text-zinc-500 bg-white/5 border-white/10'
                      )}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
