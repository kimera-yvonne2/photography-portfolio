import { useEffect, useState } from 'react'
import './index.css'

const API_BASE = 'http://127.0.0.1:8000/api'
const fallbackPhotos = [
  { id: 'leeds-markets', title: 'Leeds Markets', location: 'Leeds, United Kingdom', image: '/IMG_7305_edited.jpg' },
  { id: 'city-passage', title: 'City Passage', location: 'Leeds, United Kingdom', image: '/IMG_7307_edited.jpg' },
  { id: 'merrion-house', title: 'Merrion House', location: 'Leeds, United Kingdom', image: '/IMG_8058_edited.jpg' },
  { id: 'city-church', title: 'City Church', location: 'Leeds, United Kingdom', image: '/IMG_8053_edited.jpg' },
]
const Arrow = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>

function App() {
  const [photos, setPhotos] = useState(fallbackPhotos)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    fetch(`${API_BASE}/photos/`).then((res) => res.ok ? res.json() : Promise.reject()).then((data) => data.length && setPhotos(data.slice(0, 4))).catch(() => {})
  }, [])
  const scrollTo = (id) => { document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false) }

  return <div className="site-shell">
    <header className="nav-wrap">
      <a className="brand" href="#top" aria-label="Shots by Pato home"><span className="brand-mark">SP</span><span>Shots by Pato</span></a>
      <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
        <a href="#work" onClick={() => setMenuOpen(false)}>Portfolio</a><a href="#about" onClick={() => setMenuOpen(false)}>About</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        <button className="nav-cta" onClick={() => scrollTo('#contact')}>Book a session</button>
      </nav>
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}><span /><span /></button>
    </header>

    <main id="top">
      <section className="hero">
        <img className="hero-image" src="/IMG_8058_edited.jpg" alt="Black-and-white street scene in Leeds by Shots by Pato" />
        <div className="hero-shade" />
        <div className="hero-copy"><p className="eyebrow">Portrait · Wedding · Lifestyle</p><h1>Stories, told<br />in <em>light.</em></h1><p className="hero-intro">Honest photographs for the wildly in love, the quietly bold, and every beautiful moment in between.</p><button className="text-link light" onClick={() => scrollTo('#work')}>Explore the work <Arrow /></button></div>
        <div className="hero-meta"><span>Based in Kampala</span><span>Available worldwide</span></div>
        <button className="scroll-cue" onClick={() => scrollTo('#work')} aria-label="Scroll to portfolio"><span>Scroll</span><i /></button>
      </section>

      <section className="intro" id="about">
        <div className="section-index">01 / The story</div>
        <div className="intro-copy"><p className="eyebrow dark">Meet the artist</p><h2>I photograph the way a moment <em>feels</em>—not just how it looks.</h2><div className="intro-detail"><p>Hi, I'm Pato. A visual storyteller drawn to real connection, rich color, and the kind of moments that happen when you forget the camera is there.</p><a className="text-link" href="#contact">More about my approach <Arrow /></a></div></div>
      </section>

      <section className="work" id="work">
        <div className="work-heading"><div><p className="eyebrow dark">Selected stories</p><h2>Recent work</h2></div><p>A collection of celebrations, connections, and everything worth remembering.</p></div>
        <div className="photo-grid">{photos.map((photo, index) => <article className={`photo-card card-${index + 1}`} key={photo.id}><img src={photo.image} alt={photo.title || 'Photography by Pato'} /><div className="photo-overlay"><span>{photo.location || 'Uganda'}</span><h3>{photo.title || 'Untitled story'}</h3></div></article>)}</div>
        <a className="all-work" href="#contact">View the full portfolio <Arrow /></a>
      </section>

      <section className="quote-band"><p className="eyebrow">A note from behind the lens</p><blockquote>“The best photographs feel like a memory you can hold.”</blockquote><span>— Pato</span></section>
      <section className="contact" id="contact"><p className="eyebrow dark">Let's make something beautiful</p><div className="contact-row"><h2>Have a story<br />to <em>tell?</em></h2><div><p>Tell me what you're dreaming up. I’d love to hear about your day, your people, and the moments you want to keep forever.</p><a className="contact-button" href="mailto:hello@shotsbypato.com">Start a conversation <Arrow /></a></div></div></section>
    </main>
    <footer><a className="brand footer-brand" href="#top"><span className="brand-mark">SP</span><span>Shots by Pato</span></a><p>Portraits, weddings & stories<br />Kampala, Uganda · Worldwide</p><div className="socials"><a href="#instagram">Instagram</a><a href="mailto:hello@shotsbypato.com">Email</a></div><small>© {new Date().getFullYear()} Shots by Pato</small></footer>
  </div>
}
export default App
