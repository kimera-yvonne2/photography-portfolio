import { useEffect, useMemo, useState } from 'react'
import Lightbox from '../components/Lightbox'
import { getPhotos } from '../api'
import { imageUrl, portfolioPhotos } from '../portfolio'

export default function Gallery() {
  const [photos, setPhotos] = useState(portfolioPhotos)
  const [filter, setFilter] = useState('All')
  const [active, setActive] = useState(null)
  useEffect(() => { getPhotos().then((items) => items.length && setPhotos(items.map((item) => ({ ...item, category: item.category || 'Uncategorised', src: imageUrl(item) })))).catch(() => {}) }, [])
  const categories = useMemo(() => ['All', ...new Set(photos.map((photo) => photo.category))], [photos])
  const visible = filter === 'All' ? photos : photos.filter((photo) => photo.category === filter)
  const move = (direction) => { const index = visible.findIndex((photo) => photo.id === active?.id); setActive(visible[(index + direction + visible.length) % visible.length]) }
  return <><main className="bg-zinc-950 px-5 pb-24 pt-16 text-stone-100 md:px-8">
    <div className="mx-auto max-w-7xl"><p className="text-xs uppercase tracking-[0.28em] text-amber-300">Selected work</p><h1 className="mt-4 font-serif text-6xl leading-none md:text-8xl">The archive.</h1>
      <div className="mt-12 flex gap-5 overflow-x-auto border-y border-white/15 py-4 text-xs uppercase tracking-[0.16em]">{categories.map((category) => <button key={category} onClick={() => setFilter(category)} className={filter === category ? 'text-amber-300' : 'whitespace-nowrap text-stone-400 hover:text-white'}>{category}</button>)}</div>
      <div className="mt-8 columns-1 gap-3 sm:columns-2 lg:columns-3">{visible.map((photo, index) => <button key={photo.id} onClick={() => setActive(photo)} className="group relative mb-3 block w-full break-inside-avoid overflow-hidden bg-zinc-800 text-left"><img src={photo.src} alt={photo.title} loading={index < 6 ? 'eager' : 'lazy'} className="w-full transition duration-700 group-hover:scale-[1.03] group-hover:brightness-75" /><span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/85 p-5 text-sm transition group-hover:translate-y-0"><small className="block text-xs uppercase tracking-widest text-amber-200">{photo.category}</small>{photo.title}</span></button>)}</div>
    </div>
  </main>{active && <Lightbox photos={visible} active={active} onClose={() => setActive(null)} onMove={move} />}</>
}
