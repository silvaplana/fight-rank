import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { api } from '../api'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [token, setToken] = useState(() => window.localStorage.getItem('fr_token'))
  const [currentUser, setCurrentUser] = useState(null)
  const [fighters, setFighters] = useState([])
  const [fights, setFights] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [loading, setLoading] = useState(!!window.localStorage.getItem('fr_token'))

  useEffect(() => {
    api.organizations().then(setOrganizations).catch(() => setOrganizations([]))
  }, [])

  const loadFighterData = useCallback(async (tok) => {
    const [me, opponents, myFights] = await Promise.all([
      api.me(tok),
      api.fighters(tok),
      api.myFights(tok),
    ])
    setCurrentUser(me)
    setFighters(opponents)
    setFights(myFights)
  }, [])

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    loadFighterData(token)
      .catch(() => {
        window.localStorage.removeItem('fr_token')
        setToken(null)
        setCurrentUser(null)
      })
      .finally(() => setLoading(false))
  }, [token, loadFighterData])

  function persistToken(tok) {
    window.localStorage.setItem('fr_token', tok)
    setToken(tok)
  }

  async function login(name, password) {
    try {
      const res = await api.login({ name, password })
      persistToken(res.access_token)
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }

  async function signup({ name, password, weightCategory, organization }) {
    try {
      await api.signup({
        name,
        password,
        weight_category: weightCategory,
        organization,
      })
      // Per spec: signing up returns to the login page, it doesn't auto-connect.
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }

  function logout() {
    window.localStorage.removeItem('fr_token')
    setToken(null)
    setCurrentUser(null)
    setFighters([])
    setFights([])
  }

  async function addFight({ opponentId, result, description, videoFile }, onProgress) {
    const form = new FormData()
    form.append('opponent_id', opponentId)
    form.append('result', result)
    form.append('description', description)
    if (videoFile) form.append('video', videoFile)

    const fight = await api.createFight(token, form, onProgress)
    setFights((prev) => [fight, ...prev])
    return fight
  }

  const value = {
    loading,
    currentUser,
    fighters,
    fights,
    organizations,
    login,
    signup,
    logout,
    addFight,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within an AppProvider')
  return ctx
}
