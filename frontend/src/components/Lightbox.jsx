import { useEffect } from 'react'

export default function Lightbox({ active, onClose, onMove }) {
  useEffect(() => {
    const keydown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onMove(-1)
      if (event.key === 'ArrowRight') onMove(1)
    }
    window.addEventListener('keydown', keydown)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', keydown); document.body.style.overflow = '' }
  }, [onClose, onMove])
  if (!active) return null
  return <div className="fixed inset-0 z-50 grid grid-cols-[auto_1fr_auto] items-center bg-black/95 p-3 text-white md:p-8" role="dialog" aria-modal="true" onClick={onClose}>
    <button className="p-3 text-2xl" onClick={(event) => { event.stopPropagation(); onMove(-1) }} aria-label="Previous image">←</button>
    <figure className="m-0 flex max-h-[90vh] flex-col items-center" onClick={(event) => event.stopPropagation()}>
      <button className="absolute right-5 top-5 text-xs uppercase tracking-widest" onClick={onClose}>Close ×</button>
      <img className="max-h-[80vh] max-w-full object-contain" src={active.src} alt={active.title} />
      <figcaption className="mt-3 flex w-full max-w-4xl justify-between text-xs uppercase tracking-widest text-stone-300"><span>{active.category}</span><span>{active.title}</span></figcaption>
    </figure>
    <button className="p-3 text-2xl" onClick={(event) => { event.stopPropagation(); onMove(1) }} aria-label="Next image">→</button>
  </div>
}
