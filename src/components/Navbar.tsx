import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'

function Navbar() {
  const { user, logout } = useUser()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-green-600 px-6 py-4 flex items-center justify-between relative">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 text-white text-2xl font-bold tracking-tight">
        <span className="bg-green-800 p-2 rounded-xl inline-flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="1"  y="9"  width="3"  height="6" rx="1.5" fill="white"/>
            <rect x="4"  y="7"  width="2"  height="10" rx="1" fill="white"/>
            <rect x="6"  y="11" width="12" height="2"  rx="1" fill="white"/>
            <rect x="18" y="7"  width="2"  height="10" rx="1" fill="white"/>
            <rect x="20" y="9"  width="3"  height="6" rx="1.5" fill="white"/>
          </svg>
        </span>
        Weekly Fit
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-3">
        <Link
          to="/profile"
          className="text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Go to Profile
        </Link>
        <Link
          to="/dashboard"
          className="text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Dashboard
        </Link>
        <Link
          to="/generate"
          className="text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
        Generate weekly routine 
        </Link>
        <Link
          to="/subscribe"
          className="text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Subscription
        </Link>
        {user ? (
          <>
            <Link
              to="/profile"
              className="w-9 h-9 rounded-full bg-green-800 flex items-center justify-center text-white font-bold text-sm uppercase hover:bg-green-900 transition-colors"
            >
              {user.name.charAt(0)}
            </Link>
            <button
              onClick={logout}
              className="bg-white text-green-700 font-semibold px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
            >
              Log out
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-white text-green-600 font-semibold px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
          >
            Login / Sign Up
          </Link>
        )}
      </div>

      {/* Mobile: avatar/login + hamburger */}
      <div className="flex md:hidden items-center gap-3">
        {user ? (
          <Link
            to="/profile"
            className="w-9 h-9 rounded-full bg-green-800 flex items-center justify-center text-white font-bold text-sm uppercase hover:bg-green-900 transition-colors"
          >
            {user.name.charAt(0)}
          </Link>
        ) : (
          <Link
            to="/login"
            className="bg-white text-green-600 font-semibold px-3 py-1.5 text-sm rounded-lg hover:bg-green-50 transition-colors"
          >
            Login
          </Link>
        )}

        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="text-white p-1 rounded-lg hover:bg-green-700 transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6"  x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-green-700 flex flex-col md:hidden z-50 shadow-lg">
          <Link
            to="/profile"
            onClick={() => setMenuOpen(false)}
            className="text-white font-semibold px-6 py-4 hover:bg-green-800 transition-colors border-b border-green-600"
          >
            Go to Profile
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="text-white font-semibold px-6 py-4 hover:bg-green-800 transition-colors border-b border-green-600"
          >
            Dashboard
          </Link>
          <Link
            to="/generate"
            onClick={() => setMenuOpen(false)}
            className="text-white font-semibold px-6 py-4 hover:bg-green-800 transition-colors border-b border-green-600"
          >
        Generate weekly routine 
          </Link>
          <Link
            to="/subscribe"
            onClick={() => setMenuOpen(false)}
            className="text-white font-semibold px-6 py-4 hover:bg-green-800 transition-colors border-b border-green-600"
          >
            Subscription
          </Link>
          {user && (
            <button
              onClick={() => { setMenuOpen(false); logout() }}
              className="text-left text-white font-semibold px-6 py-4 hover:bg-green-800 transition-colors"
            >
              Log out
            </button>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
