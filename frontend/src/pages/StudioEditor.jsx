import { useState } from 'react'
import { defaultProfile, loadProfile, PROFILE_KEY } from '../content'
import { useEffect } from 'react'
import { deleteCustomPhoto, getCustomPhotos, loadPhotoSettings, prepareBasePhotos, saveCustomPhoto, savePhotoSettings } from '../photoStore'

const photoCategories = ['Portraits', 'Street', 'Nightlife', 'Gatherings', 'Experiments']

const groups = [
  { title: 'Brand', description: 'The identity shown in the navigation and footer.', fields: [['brandName', 'Studio name'], ['initials', 'Logo initials'], ['locations', 'Locations']] },
  { title: 'Opening', description: 'The first message visitors see on the portfolio.', fields: [['heroEyebrow', 'Services'], ['heroTitle', 'Main heading'], ['heroAccent', 'Heading accent'], ['heroDescription', 'Introduction', 'textarea']] },
  { title: 'About', description: 'Introduce the photographer and their approach.', fields: [['photographerName', 'Photographer name'], ['aboutTitle', 'About heading'], ['aboutAccent', 'About heading accent'], ['bio', 'Biography', 'textarea']] },
  { title: 'Testimonials', description: 'Share comments from previous clients.', fields: [['testimonial1Quote', 'Client quote 1', 'textarea'], ['testimonial1Name', 'Client name 1'], ['testimonial1Service', 'Session type 1'], ['testimonial2Quote', 'Client quote 2', 'textarea'], ['testimonial2Name', 'Client name 2'], ['testimonial2Service', 'Session type 2'], ['testimonial3Quote', 'Client quote 3', 'textarea'], ['testimonial3Name', 'Client name 3'], ['testimonial3Service', 'Session type 3']] },
  { title: 'Contact', description: 'The closing invitation and booking information.', fields: [['availability', 'Availability line'], ['contactTitle', 'Contact heading'], ['contactAccent', 'Contact heading accent'], ['email', 'Email address', 'email']] },
]

export default function StudioEditor({ baseImages }) {
  const [profile, setProfile] = useState(loadProfile)
  const [saved, setSaved] = useState(false)
  const [photoSettings, setPhotoSettings] = useState(loadPhotoSettings)
  const [customPhotos, setCustomPhotos] = useState([])
  const [photoMessage, setPhotoMessage] = useState('')
  useEffect(() => { getCustomPhotos().then(setCustomPhotos).catch(() => setPhotoMessage('Photo storage is unavailable in this browser.')) }, [])
  const library = [...prepareBasePhotos(baseImages, photoSettings), ...customPhotos]

  const update = (key, value) => { setProfile((current) => ({ ...current, [key]: value })); setSaved(false) }
  const save = (event) => {
    event.preventDefault()
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
    setSaved(true)
  }
  const reset = () => {
    if (!window.confirm('Reset all portfolio information to its original text?')) return
    setProfile(defaultProfile)
    localStorage.removeItem(PROFILE_KEY)
    setSaved(true)
  }

  const persistSettings = (next) => { setPhotoSettings(next); savePhotoSettings(next) }
  const editPhoto = async (photo, key, value) => {
    if (photo.custom) {
      const updated = { ...photo, [key]: value }
      await saveCustomPhoto(updated)
      setCustomPhotos((current) => current.map((item) => item.id === photo.id ? updated : item))
    } else {
      persistSettings({ ...photoSettings, edits: { ...photoSettings.edits, [photo.id]: { ...photoSettings.edits[photo.id], [key]: value } } })
    }
    setPhotoMessage('Photo updated')
  }
  const removePhoto = async (photo) => {
    if (!window.confirm(`Remove “${photo.title}” from the portfolio?`)) return
    if (photo.custom) { await deleteCustomPhoto(photo.id); setCustomPhotos((current) => current.filter((item) => item.id !== photo.id)) }
    else persistSettings({ ...photoSettings, hidden: [...new Set([...photoSettings.hidden, photo.id])] })
    setPhotoMessage('Photo removed')
  }
  const restoreOriginals = () => {
    persistSettings({ ...photoSettings, hidden: [] })
    setPhotoMessage('Original photos restored')
  }
  const uploadPhotos = async (event) => {
    const files = [...event.target.files]
    if (!files.length) return
    setPhotoMessage(`Adding ${files.length} photo${files.length > 1 ? 's' : ''}…`)
    const added = []
    for (const file of files) {
      const src = URL.createObjectURL(file)
      const photo = { id: `custom-${crypto.randomUUID()}`, title: file.name.replace(/\.[^.]+$/, ''), category: 'Portraits', src, custom: true, blob: file }
      await saveCustomPhoto(photo)
      added.push(photo)
    }
    setCustomPhotos((current) => [...current, ...added])
    setPhotoMessage(`${added.length} photo${added.length > 1 ? 's' : ''} added`)
    event.target.value = ''
  }

  return <div className="editor-shell">
    <aside className="editor-sidebar">
      <a className="editor-brand" href="/"><span>{profile.initials}</span><strong>Studio editor</strong></a>
      <div className="editor-side-copy"><p>Portfolio settings</p><h1>Shape how your story is told.</h1><small>Changes are stored on this device and shown on the public portfolio.</small></div>
      <a className="view-site" href="/">← View public portfolio</a>
    </aside>
    <main className="editor-main">
      <header className="editor-header"><div><p>Content management</p><h2>Photographer information</h2></div><span className={saved ? 'save-status visible' : 'save-status'}>Changes saved</span></header>
      <form onSubmit={save}>
        {groups.map((group, groupIndex) => <section className="editor-group" key={group.title}>
          <div className="editor-group-intro"><span>0{groupIndex + 1}</span><h3>{group.title}</h3><p>{group.description}</p></div>
          <div className="editor-fields">{group.fields.map(([key, label, type = 'text']) => <label key={key}><span>{label}</span>{type === 'textarea' ? <textarea value={profile[key]} rows="4" onChange={(event) => update(key, event.target.value)} /> : <input type={type} value={profile[key]} onChange={(event) => update(key, event.target.value)} />}</label>)}</div>
        </section>)}
        <div className="editor-actions"><button type="button" onClick={reset}>Reset to defaults</button><button className="save-button" type="submit">Save changes</button></div>
      </form>
      <section className="photo-manager" id="photo-library">
        <div className="photo-manager-head"><div><p>Portfolio library</p><h2>Photos</h2><span>{library.length} currently visible</span></div><div className="photo-manager-actions"><button onClick={restoreOriginals}>Restore originals</button><label className="upload-button">Add photos<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={uploadPhotos} /></label></div></div>
        {photoMessage && <p className="photo-message">{photoMessage}</p>}
        <div className="manage-grid">{library.map((photo) => <article className="manage-card" key={photo.id}>
          <div className="manage-thumb"><img src={photo.src} alt="" /><span>{photo.custom ? 'Uploaded' : 'Original'}</span></div>
          <div className="manage-fields"><label><span>Title</span><input value={photo.title} onChange={(event) => editPhoto(photo, 'title', event.target.value)} /></label><label><span>Category</span><select value={photo.category} onChange={(event) => editPhoto(photo, 'category', event.target.value)}>{photoCategories.map((category) => <option key={category}>{category}</option>)}</select></label></div>
          <button className="remove-photo" onClick={() => removePhoto(photo)}>Remove</button>
        </article>)}</div>
      </section>
    </main>
  </div>
}
