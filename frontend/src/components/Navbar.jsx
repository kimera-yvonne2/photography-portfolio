import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#2a2a2c] bg-[#0c0c0d]/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

        {/* Logo / Brand */}
        <NavLink to="/" className="font-serif text-xl tracking-wide text-[#ece9e4]">
          Atelier Lens
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8 text-sm text-[#9a9690]">
          {links.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive
                  ? 'text-[#c89b6c]'
                  : 'hover:text-[#c89b6c] transition-colors duration-200'
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-px bg-[#ece9e4] transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-px bg-[#ece9e4] transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-px bg-[#ece9e4] transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden px-6 pb-6 flex flex-col gap-4 text-sm text-[#9a9690] border-t border-[#2a2a2c]">
          {links.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive ? 'text-[#c89b6c]' : 'hover:text-[#c89b6c] transition-colors'
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}