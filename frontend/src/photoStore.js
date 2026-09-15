const DB_NAME = 'shots-by-pato-studio'

const STORE_NAME = 'custom-photos'
export const PHOTO_SETTINGS_KEY = 'shots-by-pato-photo-settings'

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME, { keyPath: 'id' })
    request.onsuccess = () => resolve(request.result.map((photo) => ({ ...photo, src: photo.blob ? URL.createObjectURL(photo.blob) : photo.src })))
    request.onerror = () => reject(request.error)
  })
}

export async function getCustomPhotos() {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const request = database.transaction(STORE_NAME).objectStore(STORE_NAME).getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveCustomPhoto(photo) {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const request = database.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put(photo)
    request.onsuccess = () => resolve(photo)
    request.onerror = () => reject(request.error)
  })
}

export async function deleteCustomPhoto(id) {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const request = database.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).delete(id)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export function loadPhotoSettings() {
  try { return { hidden: [], edits: {}, ...JSON.parse(localStorage.getItem(PHOTO_SETTINGS_KEY) || '{}') } }
  catch { return { hidden: [], edits: {} } }
}

export function savePhotoSettings(settings) {
  localStorage.setItem(PHOTO_SETTINGS_KEY, JSON.stringify(settings))
}

export function prepareBasePhotos(basePhotos, settings = loadPhotoSettings()) {
  return basePhotos.filter((photo) => !settings.hidden.includes(photo.id)).map((photo) => ({ ...photo, ...settings.edits[photo.id] }))
}
