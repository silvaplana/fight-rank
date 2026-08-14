import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function LoginPage({ onGoToSignup }) {
  const { login } = useApp()
  const [mode, setMode] = useState('choice') // 'choice' | 'login'
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const res = await login(name, password)
    setSubmitting(false)
    if (!res.ok) setError(res.error)
  }

  return (
    <div className="flex-1 flex flex-col">
      <div
        className="px-6 pt-16 pb-10 flex flex-col items-center"
        style={{
          paddingTop: 'calc(var(--safe-top) + 64px)',
          background: 'linear-gradient(160deg, #f4e9ec 0%, #eaeef6 55%, #e7ecf5 100%)',
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: 'var(--color-navy)' }}
        >
          <span className="text-2xl">🥊</span>
        </div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-navy)' }}>
          FightRank
        </h1>
        <p className="text-sm mt-1 text-center" style={{ color: 'var(--color-text-muted)' }}>
          Enregistre tes combats, suis ton classement
        </p>
      </div>

      <div className="flex-1 px-6 pt-8 pb-8 flex flex-col gap-4">
        {mode === 'choice' && (
          <>
            <button
              onClick={() => setMode('login')}
              className="w-full py-3.5 rounded-xl font-semibold text-white"
              style={{ background: 'var(--color-navy)' }}
            >
              Connexion
            </button>
            <button
              onClick={onGoToSignup}
              className="w-full py-3.5 rounded-xl font-semibold"
              style={{
                background: '#ffffff',
                color: 'var(--color-navy)',
                border: '1.5px solid var(--color-navy)',
              }}
            >
              S'inscrire
            </button>
          </>
        )}

        {mode === 'login' && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                Pseudo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl px-4 py-3 bg-white border border-black/10 outline-none"
                placeholder="Ton pseudo"
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl px-4 py-3 bg-white border border-black/10 outline-none"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="text-sm" style={{ color: 'var(--color-accent)' }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl font-semibold text-white mt-2 disabled:opacity-60"
              style={{ background: 'var(--color-accent)' }}
            >
              {submitting ? 'Connexion…' : 'Se connecter'}
            </button>
            <button
              type="button"
              onClick={() => setMode('choice')}
              className="text-sm font-medium"
              style={{ color: 'var(--color-text-muted)' }}
            >
              ← Retour
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
