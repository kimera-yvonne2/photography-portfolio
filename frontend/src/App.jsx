import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './index.css'
import { loadProfile } from './content'
import StudioEditor from './pages/StudioEditor'
import { getCustomPhotos, prepareBasePhotos } from './photoStore'
import { getPhotos, getStudioSession, signInToStudio, submitContactMessage } from './api'

const images = [
  ['IMG_8058_edited.jpg', 'City rhythm', 'Street'], ['IMG_8054_edited.jpg', 'Urban canvas', 'Street'], ['IMG_8053_edited.jpg', 'Under northern skies', 'Street'],
  ['IMG_7305_edited.jpg', 'Leeds in gold', 'Street'], ['IMG_7307_edited.jpg', 'Through the passage', 'Street'], ['IMG_8107.JPG', 'By the water', 'Portraits'],
  ['IMG_8109.JPG', 'Summer light', 'Portraits'], ['IMG_8114.JPG', 'In the moment', 'Portraits'], ['IMG_7933.JPG', 'After dark', 'Nightlife'],
  ['IMG_7925.JPG', 'Main character', 'Nightlife'], ['IMG_7955.JPG', 'Together', 'Nightlife'], ['IMG_7911.JPG', 'Yellow after midnight', 'Nightlife'],
  ['IMG_7910.JPG', 'Night stance', 'Nightlife'], ['IMG_7906.JPG', 'Flash portrait I', 'Nightlife'], ['IMG_7904.JPG', 'Call it a night', 'Nightlife'],
  ['IMG_7898.JPG', 'Inside out', 'Nightlife'], ['IMG_7868.JPG', 'Peace', 'Nightlife'], ['IMG_7811_edited.jpg', 'Joy, unposed', 'Nightlife'],
  ['IMG_7627_edited.jpg', 'Garden portrait I', 'Portraits'], ['IMG_7622_edited.jpg', 'Garden portrait II', 'Portraits'], ['IMG_7617_edited.jpg', 'Garden portrait III', 'Portraits'],
  ['IMG_7599_edited.jpg', 'Between moments', 'Portraits'], ['IMG_7590_edited.jpg', 'Quiet study', 'Portraits'], ['IMG_7335.JPG', 'Arcade portrait I', 'Portraits'],
  ['IMG_7334.JPG', 'Arcade portrait II', 'Portraits'], ['IMG_7332.JPG', 'Arcade portrait III', 'Portraits'], ['IMG_7321.JPG', 'The gallery', 'Street'],
  ['IMG_7721.JPG', 'Good company I', 'Gatherings'], ['IMG_7724.JPG', 'Good company II', 'Gatherings'], ['IMG_7720 (1).JPG', 'All together', 'Gatherings'],
  ['IMG_7720.JPG', 'The whole crew', 'Gatherings'], ['IMG_7717 (1).JPG', 'Three of us', 'Gatherings'], ['IMG_7717.JPG', 'Friends in frame', 'Gatherings'],
  ['IMG_7669.jpg', 'Old friends', 'Gatherings'], ['IMG_7661.JPG', 'At home I', 'Gatherings'], ['IMG_7660.JPG', 'At home II', 'Gatherings'],
  ['IMG_7644.JPG', 'Seated portrait I', 'Gatherings'], ['IMG_7636.JPG', 'Seated portrait II', 'Gatherings'], ['IMG_7635.JPG', 'The observer', 'Gatherings'],
  ['IMG_7743.JPG', 'Soft focus I', 'Experiments'], ['IMG_7742.JPG', 'Soft focus II', 'Experiments'], ['IMG_7739.JPG', 'Soft focus III', 'Experiments'],
  ['IMG_7736.jpg', 'Close encounter', 'Experiments'], ['IMG_7914.JPG', 'The eagle', 'Nightlife'],
].map(([file, title, category], id) => ({ id, file, title, category, src: `/${encodeURIComponent(file)}` }))

const Arrow = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M14 6l6 6-6 6" /></svg>

function StudioAccess({ baseImages }) {
  const [status, setStatus] = useState('checking')
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    getStudioSession()
      .then((session) => setStatus(session.authorized ? 'authorized' : 'unauthorized'))
      .catch(() => { setError('The studio sign-in service is unavailable.'); setStatus('unauthorized') })
  }, [])

  const signIn = async (event) => {
    event.preventDefault()
    setError('')
    setStatus('signing-in')
    try {
      const session = await signInToStudio(credentials)
      setStatus(session.authorized ? 'authorized' : 'unauthorized')
      if (!session.authorized) setError('Invalid author credentials.')
    } catch (requestError) {
      setStatus('unauthorized')
      setError(requestError.response?.detail || 'Invalid author credentials.')
    }
  }

  if (status === 'authorized') return <StudioEditor baseImages={baseImages} />
  return <main className="studio-login"><div className="studio-login-card"><Link to="/" className="studio-login-back">← Back to portfolio</Link><p>Private area</p><h1>Studio sign in</h1><span>Only the photographer’s staff account can access the editor.</span>{status === 'checking' ? <p className="studio-login-status">Checking access…</p> : <form onSubmit={signIn}><label>Username<input required autoComplete="username" value={credentials.username} onChange={(event) => setCredentials({ ...credentials, username: event.target.value })} /></label><label>Password<input required type="password" autoComplete="current-password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} /></label>{error && <p className="studio-login-error" role="alert">{error}</p>}<button type="submit" disabled={status === 'signing-in'}>{status === 'signing-in' ? 'Signing in…' : 'Sign in'}</button></form>}</div></main>
}

function App() {
  const { pathname } = useLocation()
  const [profile] = useState(loadProfile)
  const [filter, setFilter] = useState('All')
  const [active, setActive] = useState(null)
  const [portfolioImages, setPortfolioImages] = useState(() => prepareBasePhotos(images))
  const [contact, setContact] = useState({ name: '', email: '', subject: 'Photography enquiry', message: '' })
  const [contactStatus, setContactStatus] = useState('idle')
  const visible = useMemo(() => filter === 'All' ? portfolioImages : portfolioImages.filter((image) => image.category === filter), [filter, portfolioImages])
  const categories = useMemo(() => ['All', ...new Set(portfolioImages.map((image) => image.category).filter(Boolean))], [portfolioImages])
  useEffect(() => {
    Promise.allSettled([getPhotos(), getCustomPhotos()]).then(([remoteResult, customResult]) => {
      const remote = remoteResult.status === 'fulfilled' ? remoteResult.value.map((photo) => ({
        ...photo,
        id: `api-${photo.id}`,
        src: photo.thumbnail || photo.image,
        category: photo.category || 'Experiments',
      })) : []
      const local = customResult.status === 'fulfilled' ? customResult.value : []
      setPortfolioImages([...(remote.length ? remote : prepareBasePhotos(images)), ...local])
    })
  }, [])

  const sendEnquiry = async (event) => {
    event.preventDefault()
    setContactStatus('sending')
    try {
      await submitContactMessage(contact)
      setContact({ name: '', email: '', subject: 'Photography enquiry', message: '' })
      setContactStatus('sent')
    } catch {
      setContactStatus('error')
    }
  }

  const move = (direction) => {
    if (!active) return
    const index = visible.findIndex((item) => item.id === active.id)
    setActive(visible[(index + direction + visible.length) % visible.length])
  }

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') setActive(null)
      if (event.key === 'ArrowRight') move(1)
      if (event.key === 'ArrowLeft') move(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.classList.toggle('no-scroll', Boolean(active))
    return () => { window.removeEventListener('keydown', onKey); document.body.classList.remove('no-scroll') }
  })

  if (pathname === '/studio' || pathname === '/editor') return <StudioAccess baseImages={images} />

  const nav = <header className="portfolio-nav"><Link className="portfolio-brand" to="/"><span>{profile.initials}</span>{profile.brandName}</Link><nav aria-label="Main navigation"><Link to="/" className={pathname === '/' ? 'active' : ''}>Home</Link><Link to="/gallery" className={pathname === '/gallery' ? 'active' : ''}>Gallery</Link><Link to="/about" className={pathname === '/about' ? 'active' : ''}>About</Link><Link to="/contact" className={pathname === '/contact' ? 'active' : ''}>Contact</Link></nav></header>
  const footer = <footer className="portfolio-footer"><span>{profile.brandName}</span><span>© {new Date().getFullYear()}</span><span>{profile.locations}</span></footer>
  const gallery = <div className="masonry-grid">{visible.map((image, index) => <button className={`masonry-item item-${index % 7}`} key={image.id} onClick={() => setActive(image)} aria-label={`Open ${image.title}`}><img src={image.src} alt={image.title} loading={index < 5 ? 'eager' : 'lazy'} /><span>{image.title}</span></button>)}</div>

  let page
  if (pathname === '/gallery') page = <><section className="page-heading"><p>Selected archive</p><h1>The work.</h1><span>{visible.length.toString().padStart(2, '0')} photographs</span></section><div className="filter-pills" role="group" aria-label="Filter photographs">{categories.map((category) => <button key={category} className={filter === category ? 'active' : ''} onClick={() => setFilter(category)}>{category}</button>)}</div>{gallery}</>
  else if (pathname === '/about') page = <section className="about-page"><div className="about-portrait"><img src="/pato-at-elland-road.jpeg" alt={`${profile.photographerName} at Elland Road`} /></div><div className="about-copy"><p>Behind the lens · {profile.photographerName}</p><h1>{profile.aboutTitle}<em>{profile.aboutAccent}</em></h1><p className="about-bio">{profile.bio}</p><div className="kit-row"><article><span>01</span><strong>Portraiture</strong><small>Stories with character</small></article><article><span>02</span><strong>Documentary</strong><small>Life as it unfolds</small></article></div></div></section>
  else if (pathname === '/contact') page = <section className="contact-page"><div><p>{profile.availability}</p><h1>{profile.contactTitle}<em>{profile.contactAccent}</em></h1><form className="enquiry-form" onSubmit={sendEnquiry}><label>Name<input required maxLength="100" value={contact.name} onChange={(event) => setContact({ ...contact, name: event.target.value })} /></label><label>Email<input required type="email" value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} /></label><label>Subject<input required maxLength="200" value={contact.subject} onChange={(event) => setContact({ ...contact, subject: event.target.value })} /></label><label>Tell me about your plans<textarea required rows="5" value={contact.message} onChange={(event) => setContact({ ...contact, message: event.target.value })} /></label><button type="submit" disabled={contactStatus === 'sending'}>{contactStatus === 'sending' ? 'Sending…' : 'Send enquiry'} <Arrow /></button><p aria-live="polite">{contactStatus === 'sent' ? 'Thank you. Your enquiry has been received.' : contactStatus === 'error' ? 'The enquiry could not be sent. Please try again.' : ''}</p></form></div><aside className="contact-info"><span>Get in touch</span><a href={`mailto:${profile.email}`}>{profile.email}</a><p>{profile.locations}</p><p>For portraits, events, commissions, and thoughtful stories.</p></aside></section>
  else page = <section className="home-hero"><img src="/IMG_8058_edited.jpg" alt="Black and white Leeds street scene" /><span className="home-hero-wash" aria-hidden="true" /><div className="home-hero-copy"><p>{profile.heroEyebrow}</p><h1>LIFE, <em>IN FRAME.</em></h1><span>{profile.heroDescription}</span><Link to="/gallery">Explore the archive <Arrow /></Link></div></section>

  return <div className={`portfolio-view ${pathname === '/' ? 'home-view' : ''}`}>{nav}<main className={`portfolio-main ${pathname === '/' ? 'home-page' : ''}`}>{page}</main>{footer}{active && <div className="lightbox" role="dialog" aria-modal="true" aria-label={active.title} onClick={() => setActive(null)}><button className="lightbox-close" onClick={() => setActive(null)} aria-label="Close">Close ×</button><button className="lightbox-arrow prev" onClick={(event) => { event.stopPropagation(); move(-1) }} aria-label="Previous photograph">←</button><figure onClick={(event) => event.stopPropagation()}><img src={active.src} alt={active.title} /><figcaption><span>{active.category}</span><strong>{active.title}</strong></figcaption></figure><button className="lightbox-arrow next" onClick={(event) => { event.stopPropagation(); move(1) }} aria-label="Next photograph">→</button></div>}</div>
}

export default App
