const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const error = new Error('The server could not complete the request.')
    error.response = data
    throw error
  }
  return data
}

export function getPhotos() {
  return request('/photos/')
}

export function submitContactMessage(message) {
  return request('/contact/', { method: 'POST', body: JSON.stringify(message) })
}

export function getStudioSession() {
  return request('/studio/session/')
}

export function signInToStudio(credentials) {
  return request('/studio/login/', { method: 'POST', body: JSON.stringify(credentials) })
}
