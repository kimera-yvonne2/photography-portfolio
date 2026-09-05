import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const links = [['Work', '/gallery'], ['About', '/about'], ['Contact', '/contact']]

export default function SiteNav() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/90 text-stone-100 backdrop-blur">
    <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 md:px-8">
      <Link to="/" className="font-serif text-xl tracking-wide" onClick={close}>SHOTS <span className="text-amber-300">BY PATO</span></Link>
      <nav className="hidden items-center gap-7 text-xs uppercase tracking-[0.18em] md:flex">
        {links.map(([label, to]) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'text-amber-300' : 'text-stone-300 transition hover:text-white'}>{label}</NavLink>)}
        <Link to="/contact" className="border border-amber-200 px-4 py-2 text-amber-100 transition hover:bg-amber-100 hover:text-zinc-950">Book a session</Link>
      </nav>
      <button className="p-2 text-xs uppercase tracking-widest md:hidden" onClick={() => setOpen(!open)} aria-expanded={open}>Menu</button>
    </div>
    {open && <nav className="border-t border-white/10 px-5 py-5 md:hidden">
      <div className="flex flex-col gap-5 text-sm uppercase tracking-[0.16em]">{links.map(([label, to]) => <NavLink key={to} to={to} onClick={close}>{label}</NavLink>)}<Link to="/contact" onClick={close} className="text-amber-300">Book a session</Link></div>
    </nav>}
  </header>
}
