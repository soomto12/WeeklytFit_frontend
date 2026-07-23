import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import {
  IconGrid, IconDumbbell, IconStar, IconUser, IconLogOut, IconMenu, IconX,
} from './icons'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: IconGrid },
  { to: '/generate', label: 'Workouts', icon: IconDumbbell },
  { to: '/subscribe', label: 'Subscription', icon: IconStar },
  { to: '/profile', label: 'Profile', icon: IconUser },
]

const PAGE_TITLES: Record<string, string> = {
  '/home': 'Home',
  '/dashboard': 'Dashboard',
  '/generate': 'Workouts',
  '/subscribe': 'Subscription',
  '/profile': 'Profile',
}

function Logo() {
  return (
    <Link to="/dashboard" className="flex items-center gap-2.5 text-white text-lg font-bold tracking-tight px-6 py-5">
      <span className="bg-emerald-400/10 border border-emerald-400/20 p-2 rounded-xl inline-flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="1" y="9" width="3" height="6" rx="1.5" fill="#34d399" />
          <rect x="4" y="7" width="2" height="10" rx="1" fill="#34d399" />
          <rect x="6" y="11" width="12" height="2" rx="1" fill="#34d399" />
          <rect x="18" y="7" width="2" height="10" rx="1" fill="#34d399" />
          <rect x="20" y="9" width="3" height="6" rx="1.5" fill="#34d399" />
        </svg>
      </span>
      <span className="text-emerald-400">Weekly Fit</span>
    </Link>
  )
}

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
                : 'text-neutral-400 border border-transparent hover:text-white hover:bg-white/5'
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

function UserCard() {
  const { user } = useUser()
  return (
    <Link
      to="/profile"
      className="mx-3 mb-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 hover:border-emerald-400/30 transition-colors"
    >
      {user?.image ? (
        <img src={user.image} alt={user.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
      ) : (
        <div className="w-9 h-9 rounded-full bg-emerald-400 flex items-center justify-center shrink-0">
          <span className="text-neutral-950 font-bold text-sm uppercase">{user?.name?.charAt(0) ?? '?'}</span>
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white truncate">{user?.name ?? 'Athlete'}</p>
        <p className="text-xs text-neutral-500 truncate">{user?.email ?? ''}</p>
      </div>
    </Link>
  )
}

function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 md:h-screen md:sticky md:top-0 border-r border-white/10 bg-neutral-950">
      <Logo />
      <div className="flex-1 flex flex-col gap-1 mt-2">
        <NavItems />
      </div>
      <UserCard />
    </aside>
  )
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-72 bg-neutral-950 border-r border-white/10 flex flex-col">
        <div className="flex items-center justify-between pr-3">
          <Logo />
          <button onClick={onClose} className="text-neutral-400 hover:text-white p-2" aria-label="Close menu">
            <IconX size={20} />
          </button>
        </div>
        <div className="flex-1 flex flex-col gap-1 mt-2">
          <NavItems onNavigate={onClose} />
        </div>
        <UserCard />
      </div>
    </div>
  )
}

function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { logout } = useUser()
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] ?? 'Athlete Hub'

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 md:px-8 h-16 border-b border-white/10 bg-neutral-950/80 backdrop-blur">
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onMenuClick} className="md:hidden text-neutral-400 hover:text-white p-1.5 -ml-1.5" aria-label="Open menu">
          <IconMenu size={22} />
        </button>
        <span className="text-white font-semibold text-lg truncate">Athlete Hub</span>
      </div>

      <nav className="hidden lg:flex items-center gap-1">
        {NAV_ITEMS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive ? 'text-emerald-400' : 'text-neutral-400 hover:text-white'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-2 shrink-0">
        <Link
          to="/profile"
          className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/20 transition-colors"
          aria-label="Profile"
        >
          <IconUser size={18} />
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-sm font-semibold text-neutral-300 hover:text-white border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 transition-colors"
        >
          <IconLogOut size={16} />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
      <span className="sr-only">{title}</span>
    </header>
  )
}

function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="min-h-screen bg-neutral-950 flex">
      <Sidebar />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header onMenuClick={() => setDrawerOpen(true)} />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppShell
