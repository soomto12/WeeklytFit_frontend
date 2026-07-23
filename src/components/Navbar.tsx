import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { IconMenu, IconX } from './icons'

function Navbar() {
  const { user } = useUser()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight">
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

      <div className="hidden md:flex items-center gap-3">
        {user ? (
          <Link to="/dashboard" className="btn-accent px-5 py-2.5 text-sm">Go to Dashboard</Link>
        ) : (
          <Link to="/login" className="btn-accent px-5 py-2.5 text-sm">Login / Sign Up</Link>
        )}
      </div>

      <button
        onClick={() => setMenuOpen(o => !o)}
        className="md:hidden text-neutral-300 hover:text-white p-1.5"
        aria-label="Toggle menu"
      >
        {menuOpen ? <IconX size={22} /> : <IconMenu size={22} />}
      </button>

      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-neutral-950 border-b border-white/10 flex flex-col md:hidden">
          {user ? (
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="text-white font-semibold px-6 py-4 hover:bg-white/5 transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="text-white font-semibold px-6 py-4 hover:bg-white/5 transition-colors"
            >
              Login / Sign Up
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
