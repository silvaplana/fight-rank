// Thin fetch wrapper. In dev, Vite proxies /api to the FastAPI backend (see
// vite.config.js). In prod (Docker), VITE_API_URL is baked in at build time
// as the full browser-facing path, e.g. "/fight-rank/api" — see Dockerfile.
const API_URL = import.meta.env.VITE_API_URL || '/api'

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

export const api = {
  organizations: () => request('/organizations'),
  signup: (data) => request('/auth/signup', { method: 'POST', json: data }),
  login: (data) => request('/auth/login', { method: 'POST', json: data }),
  me: (token) => request('/fighters/me', { token }),
  fighters: (token) => request('/fighters', { token }),
  myFights: (token) => request('/fights/me', { token }),
  createFight: (token, form) => request('/fights', { method: 'POST', token, form }),
}
