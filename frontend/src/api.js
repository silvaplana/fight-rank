// Thin fetch wrapper. In dev, Vite proxies /api to the FastAPI backend (see
// vite.config.js). In prod (Docker), VITE_API_URL is baked in at build time
// as the full browser-facing path, e.g. "/fight-rank/api" — see Dockerfile.
const API_URL = import.meta.env.VITE_API_URL || '/api'
// Backend media links come back as "/media/...", relative to the backend's
// own root. Re-derive the site prefix from API_URL (strip trailing "/api")
// so video URLs resolve correctly whether we're at "/" (dev) or
// "/fight-rank/" (prod) — same trick without a second build-time env var.
const SITE_PREFIX = API_URL.replace(/\/api$/, '')

async function request(path, { method = 'GET', token, json, form } = {}) {
  path = `${API_URL}${path}`
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (json) headers['Content-Type'] = 'application/json'

  const res = await fetch(path, {
    method,
    headers,
    body: form ? form : json ? JSON.stringify(json) : undefined,
  })

  if (!res.ok) {
    let detail = res.statusText
    try {
      const body = await res.json()
      detail = body.detail || detail
    } catch {
      // ignore non-JSON error bodies
    }
    throw new Error(detail)
  }

  if (res.status === 204) return null
  return res.json()
}

export function mediaUrl(path) {
  return path ? `${SITE_PREFIX}${path}` : null
}

// Plain fetch() has no upload-progress event, so the video upload goes
// through XMLHttpRequest instead — needed to drive the progress bar in
// FightTab while a (possibly large) video is sending.
function createFight(token, form, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${API_URL}/fights`)
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)

    xhr.upload.onprogress = (e) => {
      if (onProgress && e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      let body = null
      try {
        body = JSON.parse(xhr.responseText)
      } catch {
        // non-JSON response body, ignore
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(body)
      } else {
        reject(new Error(body?.detail || xhr.statusText || 'Erreur réseau'))
      }
    }
    xhr.onerror = () => reject(new Error('Erreur réseau'))

    xhr.send(form)
  })
}

export const api = {
  organizations: () => request('/organizations'),
  signup: (data) => request('/auth/signup', { method: 'POST', json: data }),
  login: (data) => request('/auth/login', { method: 'POST', json: data }),
  me: (token) => request('/fighters/me', { token }),
  fighters: (token) => request('/fighters', { token }),
  myFights: (token) => request('/fights/me', { token }),
  createFight,
}
