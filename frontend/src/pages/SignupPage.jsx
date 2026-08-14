import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { WEIGHT_CATEGORIES } from '../data/mockData'
import Header from '../components/Header'

export default function SignupPage({ onDone, onCancel }) {
  const { signup, organizations } = useApp()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [weightCategory, setWeightCategory] = useState(WEIGHT_CATEGORIES[0])
  const [organization, setOrganization] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const orgValue = organization || organizations[0]?.name || ''

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const res = await signup({ name, password, weightCategory, organization: orgValue })
    setSubmitting(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    onDone()
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Inscription" subtitle="Rejoins ton organisation" />

      <form onSubmit={handleSubmit} className="flex-1 px-6 pt-6 pb-8 flex flex-col gap-4">
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

        <div>
          <label className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
            Catégorie de poids
          </label>
          <select
            value={weightCategory}
            onChange={(e) => setWeightCategory(e.target.value)}
            className="mt-1 w-full rounded-xl px-4 py-3 bg-white border border-black/10 outline-none"
          >
            {WEIGHT_CATEGORIES.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
            Organisation
          </label>
          <select
            value={orgValue}
            onChange={(e) => setOrganization(e.target.value)}
            className="mt-1 w-full rounded-xl px-4 py-3 bg-white border border-black/10 outline-none"
          >
            {organizations.map((o) => (
              <option key={o.name} value={o.name}>
                {o.name}
              </option>
            ))}
          </select>
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
          {submitting ? 'Inscription…' : "Valider l'inscription"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-medium"
          style={{ color: 'var(--color-text-muted)' }}
        >
          ← Retour
        </button>
      </form>
    </div>
  )
}
