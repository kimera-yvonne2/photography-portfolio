import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = 'http://127.0.0.1:8000/api'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    fetch(`${API_BASE}/photos/`)
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => {
        // show only featured photos on homepage
        const featuredPhotos = data.filter((p) => p.is_featured).slice(0, 6)
        setFeatured(featuredPhotos)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <main className="pt-20">

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center text-center
                          px-6 py-32 md:py-48 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#c89b6c12_0%,_transparent_70%)] pointer-events-none" />

        <p className="text-xs tracking-[0.3em] uppercase text-[#c89b6c] mb-4">
          Visual Storytelling
        </p>

        <h1 className="font-serif font-medium leading-[1.05] tracking-tight
                       text-[clamp(52px,10vw,120px)] text-[#ece9e4] max-w-4xl">
          SHOTS BY PATO
        </h1>

        <div className="mt-4 h-1 w-20 bg-gradient-to-r from-transparent via-[#c89b6c] to-transparent mx-auto"></div>

        <p className="mt-8 text-lg text-[#9a9690] max-w-2xl leading-relaxed">
          Capturing moments that matter. Every shot is a testament to light, emotion, and the beauty found in between.
        </p>

        <div className="mt-10 flex gap-4 flex-wrap justify-center">
          <Link
            to="/gallery"
            className="px-8 py-3 bg-[#c89b6c] text-[#0c0c0d] text-sm font-medium
                       rounded-full hover:bg-[#d4aa80] transition-colors duration-200"
          >
            View Gallery
          </Link>
          <Link
            to="/contact"
            className="px-8 py-3 border border-[#2a2a2c] text-sm text-[#9a9690]
                       rounded-full hover:border-[#c89b6c] hover:text-[#c89b6c]
                       transition-colors duration-200"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-[#2a2a2c] mx-12" />

      {/* ── Featured Photos ── */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <h2 className="font-serif text-3xl md:text-4xl text-[#ece9e4]">
            Featured Work
          </h2>
          <Link
            to="/gallery"
            className="text-sm text-[#9a9690] hover:text-[#c89b6c] transition-colors"
          >
            View all →
          </Link>
        </div>

        {status === 'loading' && (
          <p className="text-center py-16 text-[#9a9690]">Loading…</p>
        )}

        {status === 'error' && (
          <p className="text-center py-16 text-[#9a9690]">
            Backend not reachable. Make sure Django is running on port 8000.
          </p>
        )}

        {status === 'ready' && featured.length === 0 && (
          <p className="text-center py-16 text-[#9a9690]">
            No featured photos yet — mark some as featured in the Django admin.
          </p>
        )}

        {status === 'ready' && featured.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
            {featured.map((photo) => (
              <div
                key={photo.id}
                className="group relative aspect-[4/5] overflow-hidden bg-[#161616]"
              >
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-full object-cover brightness-75 grayscale-[30%] scale-[1.02]
                             transition-all duration-700 ease-out
                             group-hover:brightness-100 group-hover:grayscale-0 group-hover:scale-110"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 p-4
                              bg-gradient-to-t from-black/80 to-transparent
                              opacity-0 translate-y-2 transition-all duration-300
                              group-hover:opacity-100 group-hover:translate-y-0"
                >
                  <p className="text-sm font-medium text-[#ece9e4]">{photo.title}</p>
                  {photo.location && (
                    <p className="text-xs text-[#9a9690] mt-1">{photo.location}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#2a2a2c] px-12 py-8 text-center text-sm text-[#9a9690]">
        © {new Date().getFullYear()} Atelier Lens · All rights reserved
      </footer>
    </main>
  )
}