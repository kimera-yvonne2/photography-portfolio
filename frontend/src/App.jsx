import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './index.css'
import { loadProfile } from './content'
import StudioEditor from './pages/StudioEditor'
import { getCustomPhotos, prepareBasePhotos } from './photoStore'
import { getPhotos, submitContactMessage } from './api'

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

const categoryCovers = [
  { name: 'Portraits', image: 'IMG_7622_edited.jpg', note: 'People, presence & personality' },
  { name: 'Street', image: 'IMG_8058_edited.jpg', note: 'Architecture, movement & city life' },
  { name: 'Nightlife', image: 'IMG_7933.JPG', note: 'After-dark portraits & energy' },
  { name: 'Gatherings', image: 'IMG_7720.JPG', note: 'Friends, celebrations & connection' },
  { name: 'Experiments', image: 'IMG_7739.JPG', note: 'Soft focus & playful studies' },
]

const Arrow = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M14 6l6 6-6 6" /></svg>

function App() {
  const { pathname } = useLocation()
  const [profile] = useState(loadProfile)
  const [filter, setFilter] = useState('All')
  const [active, setActive] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [portfolioImages, setPortfolioImages] = useState(() => prepareBasePhotos(images))
  const [contact, setContact] = useState({ name: '', email: '', subject: 'Photography enquiry', message: '' })
  const [contactStatus, setContactStatus] = useState('idle')
  const visible = useMemo(() => filter === 'All' ? portfolioImages : portfolioImages.filter((image) => image.category === filter), [filter, portfolioImages])
  const categories = useMemo(() => ['All', ...new Set(portfolioImages.map((image) => image.category).filter(Boolean))], [portfolioImages])
  const collections = useMemo(() => categories.slice(1).map((name) => {
    const fallback = categoryCovers.find((collection) => collection.name === name)
    const firstPhoto = portfolioImages.find((photo) => photo.category === name)
    return {
      name,
      image: firstPhoto?.src || (fallback ? `/${encodeURIComponent(fallback.image)}` : ''),
      note: fallback?.note || `${portfolioImages.filter((photo) => photo.category === name).length} photographs`,
    }
  }), [categories, portfolioImages])

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

  if (pathname === '/studio' || pathname === '/editor') return <StudioEditor baseImages={images} />

  return <div className="site-shell" id="top">
    <header className="nav-wrap">
      <a className="brand" href="#top"><span className="brand-mark">{profile.initials}</span><span>{profile.brandName}</span></a>
      <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
        <a href="#top" onClick={() => setMenuOpen(false)}>Work</a>
        <a href="#collections" onClick={() => setMenuOpen(false)}>Collections</a>
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
        <a href="#testimonials" onClick={() => setMenuOpen(false)}>Testimonials</a>
        <a className="nav-book" href="#book" onClick={() => setMenuOpen(false)}>Book</a>
        <a href="#contract" onClick={() => setMenuOpen(false)}>Contract</a>
      </nav>
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu"><span /><span /></button>
    </header>

    <main>
      <section className="hero">
        <img src="/IMG_8058_edited.jpg" alt="Black and white Leeds street scene" />
        <div className="hero-wash" />
        <div className="hero-copy">
          <p className="eyebrow">{profile.heroEyebrow}</p>
          <h1>{profile.heroTitle}<br /><em>{profile.heroAccent}</em></h1>
          <p className="hero-note">{profile.heroDescription}</p>
          <a className="text-link light" href="#collections">Explore the archive <Arrow /></a>
        </div>
        <div className="hero-side">{profile.locations}</div>
      </section>

      <section className="manifesto" id="about">
        <img className="manifesto-background" src="/pato-at-elland-road.jpeg" alt="" aria-hidden="true" />
        <span className="manifesto-wash" aria-hidden="true" />
        <p className="section-no">01 / About the work</p>
        <div><p className="eyebrow accent">Behind the lens · {profile.photographerName}</p><h2>{profile.aboutTitle}<br /><em>{profile.aboutAccent}</em></h2></div>
        <p className="manifesto-copy">{profile.bio}</p>
      </section>

      <section className="portfolio" id="collections">
        <div className="portfolio-head">
          <div><p className="eyebrow accent">02 / Selected archive</p><h2>The work</h2></div>
          <p>{filter === 'All' ? 'Choose a collection' : `${visible.length.toString().padStart(2, '0')} photographs`}</p>
        </div>
        <div className="filters" role="group" aria-label="Filter photographs">
          {categories.map((category) => <button key={category} className={filter === category ? 'active' : ''} onClick={() => setFilter(category)}>{category}</button>)}
        </div>
        {filter === 'All' ? <div className="collection-grid">
          {collections.map((collection, index) => <button className="collection-card" key={collection.name} onClick={() => setFilter(collection.name)}>
            <img src={collection.image} alt={`${collection.name} collection`} />
            <span className="collection-shade" />
            <span className="collection-copy"><i>0{index + 1} / Collection</i><strong>{collection.name}</strong><small>{collection.note}</small><b>View collection <Arrow /></b></span>
          </button>)}
        </div> : <>
          <button className="back-to-collections" onClick={() => setFilter('All')}>← Back to collections</button>
          <div className="gallery">
            {visible.map((image, index) => <button className={`gallery-item item-${index % 7}`} key={image.id} onClick={() => setActive(image)} aria-label={`Open ${image.title}`}>
              <img src={image.src} alt={image.title} loading={index < 5 ? 'eager' : 'lazy'} />
              <span className="image-caption"><i>{image.category}</i><strong>{image.title}</strong></span>
            </button>)}
          </div>
        </>}
      </section>

      <section className="pricing" id="pricing">
        <div className="pricing-head"><p className="eyebrow accent">03 / Investment</p><h2>Choose your<br /><em>kind of story.</em></h2><p>Every session is shaped around you. These starting points can be tailored to the scale, location, and rhythm of your plans.</p></div>
        <div className="pricing-grid">
          <article><span>01</span><h3>Portraits</h3><p>Individual, couple, graduation, or creative portrait sessions in a location that feels like you.</p><strong>From £150</strong><a href="#book">Enquire <Arrow /></a></article>
          <article><span>02</span><h3>Events</h3><p>Natural, energetic coverage of celebrations, dinners, launches, and the people who make them matter.</p><strong>From £300</strong><a href="#book">Enquire <Arrow /></a></article>
          <article><span>03</span><h3>Commissions</h3><p>Editorial, brand, travel, and longer-form stories built around a considered creative brief.</p><strong>Custom quote</strong><a href="#book">Start a brief <Arrow /></a></article>
        </div>
      </section>

      <section className="testimonials" id="testimonials">
        <div className="testimonials-head">
          <p className="eyebrow accent">04 / Client notes</p>
          <h2>Kind words from<br /><em>behind the photographs.</em></h2>
        </div>
        <div className="testimonial-grid">
          {[
            [profile.testimonial1Quote, profile.testimonial1Name, profile.testimonial1Service],
            [profile.testimonial2Quote, profile.testimonial2Name, profile.testimonial2Service],
            [profile.testimonial3Quote, profile.testimonial3Name, profile.testimonial3Service],
          ].map(([quote, name, service], index) => <blockquote className="testimonial-card" key={name}>
            <span>0{index + 1}</span>
            <p>“{quote}”</p>
            <footer><strong>{name}</strong><small>{service}</small></footer>
          </blockquote>)}
        </div>
      </section>

      <section className="contact" id="book">
        <p className="eyebrow">{profile.availability}</p>
        <h2>{profile.contactTitle}<br /><em>{profile.contactAccent}</em></h2>
        <form className="contact-form" onSubmit={sendEnquiry}>
          <label><span>Name</span><input required maxLength="100" value={contact.name} onChange={(event) => setContact({ ...contact, name: event.target.value })} /></label>
          <label><span>Email</span><input required type="email" value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} /></label>
          <label><span>Subject</span><input required maxLength="200" value={contact.subject} onChange={(event) => setContact({ ...contact, subject: event.target.value })} /></label>
          <label className="contact-message"><span>Tell me about your plans</span><textarea required rows="5" value={contact.message} onChange={(event) => setContact({ ...contact, message: event.target.value })} /></label>
          <button type="submit" disabled={contactStatus === 'sending'}>{contactStatus === 'sending' ? 'Sending...' : 'Send enquiry'} <Arrow /></button>
          <p className="contact-feedback" aria-live="polite">{contactStatus === 'sent' ? 'Thank you. Your enquiry has been received.' : contactStatus === 'error' ? 'The enquiry could not be sent. Please try again.' : ''}</p>
        </form>
        <a href={`mailto:${profile.email}`} className="contact-email">Or email {profile.email}</a>
        <div className="contract-note" id="contract"><span>Ready for the details?</span><p>Once your date and scope are confirmed, request the photography agreement to review deliverables, usage, payment, and cancellation terms.</p><a href={`mailto:${profile.email}?subject=Photography contract request`}>Request contract <Arrow /></a></div>
      </section>
    </main>

    <footer><a className="brand" href="#top"><span className="brand-mark">{profile.initials}</span><span>{profile.brandName}</span></a><span>© {new Date().getFullYear()}</span><span>{profile.locations}</span></footer>

    {active && <div className="lightbox" role="dialog" aria-modal="true" aria-label={active.title} onClick={() => setActive(null)}>
      <button className="lightbox-close" onClick={() => setActive(null)} aria-label="Close">Close ×</button>
      <button className="lightbox-arrow prev" onClick={(event) => { event.stopPropagation(); move(-1) }} aria-label="Previous photograph">←</button>
      <figure onClick={(event) => event.stopPropagation()}><img src={active.src} alt={active.title} /><figcaption><span>{active.category}</span><strong>{active.title}</strong></figcaption></figure>
      <button className="lightbox-arrow next" onClick={(event) => { event.stopPropagation(); move(1) }} aria-label="Next photograph">→</button>
    </div>}
  </div>
}

export default App
