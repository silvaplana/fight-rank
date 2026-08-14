// Thin fetch wrapper. In dev, Vite proxies /api and /media to the FastAPI
// backend (see vite.config.js); in prod, nginx does the same on the VPS.
//
// VITE_API_BASE lets the same build call the API under a sub-path
// (e.g. "/fight-rank" so requests land on /fight-rank/api/...). Empty in dev.
const API_BASE = import.meta.env.VITE_API_BASE || ''

async function request(path, { method = 'GET', token, json, form } = {}) {
  path = `${API_BASE}${path}`
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

export const api = {
  organizations: () => request('/api/organizations'),
  signup: (data) => request('/api/auth/signup', { method: 'POST', json: data }),
  login: (data) => request('/api/auth/login', { method: 'POST', json: data }),
  me: (token) => request('/api/fighters/me', { token }),
  fighters: (token) => request('/api/fighters', { token }),
  myFights: (token) => request('/api/fights/me', { token }),
  createFight: (token, form) => request('/api/fights', { method: 'POST', token, form }),
}
