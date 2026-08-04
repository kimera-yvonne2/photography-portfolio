import { useEffect, useMemo, useState } from 'react'
import './index.css'

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

const categories = ['All', 'Portraits', 'Street', 'Nightlife', 'Gatherings', 'Experiments']
const categoryCovers = [
  { name: 'Portraits', image: 'IMG_7622_edited.jpg', note: 'People, presence & personality' },
  { name: 'Street', image: 'IMG_8058_edited.jpg', note: 'Architecture, movement & city life' },
  { name: 'Nightlife', image: 'IMG_7933.JPG', note: 'After-dark portraits & energy' },
  { name: 'Gatherings', image: 'IMG_7720.JPG', note: 'Friends, celebrations & connection' },
  { name: 'Experiments', image: 'IMG_7739.JPG', note: 'Soft focus & playful studies' },
]

const Arrow = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M14 6l6 6-6 6" /></svg>

function App() {
  const [filter, setFilter] = useState('All')
  const [active, setActive] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const visible = useMemo(() => filter === 'All' ? images : images.filter((image) => image.category === filter), [filter])

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

  return <div className="site-shell" id="top">
    <header className="nav-wrap">
      <a className="brand" href="#top"><span className="brand-mark">SP</span><span>Shots by Pato</span></a>
      <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
        <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
      </nav>
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu"><span /><span /></button>
    </header>

    <main>
      <section className="hero">
        <img src="/IMG_8058_edited.jpg" alt="Black and white Leeds street scene" />
        <div className="hero-wash" />
        <div className="hero-copy">
          <p className="eyebrow">Portrait · Street · Life</p>
          <h1>Life,<br /><em>in frame.</em></h1>
          <p className="hero-note">Honest portraits and restless city stories—photographed with warmth, instinct, and a love for the in-between.</p>
          <a className="text-link light" href="#work">Explore the archive <Arrow /></a>
        </div>
        <div className="hero-side">Kampala · Leeds · Everywhere</div>
      </section>

      <section className="manifesto" id="about">
        <p className="section-no">01 / About the work</p>
        <div><p className="eyebrow accent">Behind the lens</p><h2>People as they are.<br />Places as they <em>feel.</em></h2></div>
        <p className="manifesto-copy">I’m Pato, a photographer drawn to character, connection, and the energy of everyday life. My work lives between documentary and portraiture—considered, but never over-polished.</p>
      </section>

      <section className="portfolio" id="work">
        <div className="portfolio-head">
          <div><p className="eyebrow accent">02 / Selected archive</p><h2>The work</h2></div>
          <p>{filter === 'All' ? 'Choose a collection' : `${visible.length.toString().padStart(2, '0')} photographs`}</p>
        </div>
        <div className="filters" role="group" aria-label="Filter photographs">
          {categories.map((category) => <button key={category} className={filter === category ? 'active' : ''} onClick={() => setFilter(category)}>{category}</button>)}
        </div>
        {filter === 'All' ? <div className="collection-grid">
          {categoryCovers.map((collection, index) => <button className="collection-card" key={collection.name} onClick={() => setFilter(collection.name)}>
            <img src={`/${encodeURIComponent(collection.image)}`} alt={`${collection.name} collection`} />
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

      <section className="contact" id="contact">
        <p className="eyebrow">Available for portraits, events & stories</p>
        <h2>Let’s make something<br /><em>worth keeping.</em></h2>
        <a href="mailto:hello@shotsbypato.com" className="contact-link">hello@shotsbypato.com <Arrow /></a>
      </section>
    </main>

    <footer><a className="brand" href="#top"><span className="brand-mark">SP</span><span>Shots by Pato</span></a><span>© {new Date().getFullYear()}</span><span>Kampala · Available worldwide</span></footer>

    {active && <div className="lightbox" role="dialog" aria-modal="true" aria-label={active.title} onClick={() => setActive(null)}>
      <button className="lightbox-close" onClick={() => setActive(null)} aria-label="Close">Close ×</button>
      <button className="lightbox-arrow prev" onClick={(event) => { event.stopPropagation(); move(-1) }} aria-label="Previous photograph">←</button>
      <figure onClick={(event) => event.stopPropagation()}><img src={active.src} alt={active.title} /><figcaption><span>{active.category}</span><strong>{active.title}</strong></figcaption></figure>
      <button className="lightbox-arrow next" onClick={(event) => { event.stopPropagation(); move(1) }} aria-label="Next photograph">→</button>
    </div>}
  </div>
}

export default App
