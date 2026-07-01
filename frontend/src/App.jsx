import { useEffect, useState } from 'react'
import './index.css'

const API_BASE = 'http://127.0.0.1:8000/api'
const HERO_IMAGE = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80' // Beautiful green nature landscape

function App() {
  const [photos, setPhotos] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error | empty

  useEffect(() => {
    fetch(`${API_BASE}/photos/`)
      .then((res) => {
        if (!res.ok) throw new Error('Request failed')
        return res.json()
      })
      .then((data) => {
        setPhotos(data)
        setStatus(data.length ? 'ready' : 'empty')
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div className="font-sans bg-gradient-to-b from-blue-950 via-indigo-900 to-slate-900 min-h-screen">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-blue-950/80 border-b border-cyan-400/20 shadow-lg">
        <div className="flex justify-between items-center px-12 py-7">
          <span className="font-serif text-2xl tracking-wider bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-400 bg-clip-text text-transparent font-bold drop-shadow-lg">
            SHOTS BY PATO
          </span>
          <nav className="flex gap-8 text-sm">
            <a href="#work" className="text-gray-300 hover:text-cyan-300 transition-colors duration-300 font-medium">Work</a>
            <a href="#about" className="text-gray-300 hover:text-cyan-300 transition-colors duration-300 font-medium">About</a>
            <a href="#contact" className="text-gray-300 hover:text-cyan-300 transition-colors duration-300 font-medium">Contact</a>
          </nav>
        </div>
      </header>

      <section className="relative px-12 py-12 overflow-hidden">
        {/* Hero image section with overlay */}
        <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/20 border border-cyan-400/30 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Left side - Text content */}
            <div className="relative z-10 flex flex-col justify-center p-12 md:p-16 bg-gradient-to-br from-lime-300 via-emerald-300 to-green-300 backdrop-blur-sm">
              <p className="text-sm tracking-[0.3em] uppercase text-emerald-900 mb-6 font-semibold">
                 Visual Storytelling 
              </p>

              <h1 className="font-serif font-bold text-5xl md:text-6xl leading-[1.1] mb-8 bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 bg-clip-text text-transparent">
                SHOTS BY PATO
              </h1>

              <div className="flex gap-3 mb-8">
                <div className="h-1 w-12 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full"></div>
                <div className="h-1 w-12 bg-gradient-to-r from-green-600 to-teal-600 rounded-full"></div>
                <div className="h-1 w-12 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full"></div>
              </div>

              <p className="text-lg text-emerald-900 mb-10 leading-relaxed max-w-lg font-medium">
                Capturing moments that matter. Every shot is a testament to light, emotion, and the beauty found in between.
              </p>

              <div className="flex gap-6 flex-wrap">
                <button className="group px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-lg hover:shadow-xl hover:shadow-emerald-400/50 transition-all duration-300 transform hover:scale-105">
                  Explore Gallery
                  <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button className="group px-8 py-3 border-2 border-emerald-700 text-emerald-900 font-bold rounded-lg hover:bg-emerald-700/10 hover:border-emerald-900 transition-all duration-300 backdrop-blur-sm">
                  Get in Touch
                  <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            {/* Right side - Hero image */}
            <div className="relative overflow-hidden h-96 md:h-auto">
              <img 
                src={HERO_IMAGE} 
                alt="Featured Photography" 
                className="w-full h-full object-cover brightness-75 hover:brightness-100 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-blue-900/40"></div>
            </div>
          </div>

          {/* Animated background elements */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-500/20 to-cyan-500/10 rounded-full blur-3xl opacity-50 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      </section>

      <section id="work" className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 px-12 pb-16 max-w-7xl mx-auto">
        {status === 'loading' && (
          <div className="col-span-full text-center py-16">
            <div className="inline-block">
              <div className="h-12 w-12 border-4 border-cyan-400 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-300 font-medium">Loading gallery…</p>
            </div>
          </div>
        )}
        {status === 'error' && (
          <p className="col-span-full text-center py-16 text-red-400 font-medium">
            Couldn't reach the gallery server. Check that the Django backend is running on port 8000.
          </p>
        )}
        {status === 'empty' && (
          <p className="col-span-full text-center py-16 text-gray-400">
            No photos published yet. Add some from the Django admin.
          </p>
        )}
        {status === 'ready' &&
          photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-4/5 overflow-hidden bg-slate-800 rounded-xl border border-cyan-500/20 hover:border-cyan-400/60 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500 cursor-pointer">
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-full object-cover grayscale-[40%] brightness-75 scale-[1.02]
                           transition-all duration-700 ease-out
                           group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-sm
                              opacity-0 translate-y-4
                              transition-all duration-300
                              group-hover:opacity-100 group-hover:translate-y-0">
                <strong className="text-cyan-300 text-lg block">{photo.title}</strong>
                {photo.location && <span className="text-gray-300 text-sm">📍 {photo.location}</span>}
              </div>
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/0 via-transparent to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-500 pointer-events-none"></div>
            </div>
          ))}
      </section>

      <footer id="contact" className="border-t border-cyan-500/30 bg-blue-950/50 backdrop-blur-sm px-12 py-12 text-center">
        <p className="text-gray-400 mb-4">
          © {new Date().getFullYear()} <span className="text-cyan-400 font-bold">SHOTS BY PATO</span>. Built with <span className="text-blue-400">❤️</span> using Django & React.
        </p>
        <div className="flex gap-6 justify-center text-gray-400 text-sm">
          <a href="#" className="hover:text-cyan-400 transition-colors">Instagram</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Email</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Portfolio</a>
        </div>
      </footer>
    </div>
  )
}

export default App