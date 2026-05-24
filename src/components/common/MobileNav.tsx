import { NavLink } from 'react-router-dom'
import { Home, Film, Ticket, Tag, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/movies', icon: Film, label: 'Movies' },
  { to: '/profile/bookings', icon: Ticket, label: 'Bookings' },
  { to: '/offers', icon: Tag, label: 'Offers' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/90 backdrop-blur-xl border-t border-white/10">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors min-w-[56px]',
                isActive ? 'text-primary' : 'text-zinc-500'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  'p-1 rounded-lg transition-colors',
                  isActive && 'bg-primary/10'
                )}>
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.5} />
                </div>
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
