import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { RESULTS, DESCRIPTIONS } from '../../data/mockData'
import { VideoIcon } from '../../components/icons'

const emptyForm = { opponentId: '', result: '', description: '', videoFile: null }

export default function FightTab() {
  const { fighters, addFight } = useApp()
  const [form, setForm] = useState(emptyForm)
  const [locked, setLocked] = useState(false)
  const [savedFight, setSavedFight] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleFile(e) {
    update('videoFile', e.target.files?.[0] || null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.opponentId || !form.result || !form.description) return
    setError('')
    setSubmitting(true)
    try {
      const fight = await addFight(form)
      setSavedFight(fight)
      setLocked(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  function handleCancel() {
    setForm(emptyForm)
    setLocked(false)
    setSavedFight(null)
    setError('')
  }

  return (
    <div className="px-5 pt-5 pb-6 flex flex-col gap-4">
      {locked && savedFight && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ background: 'var(--color-accent-soft)', color: 'var(--color-navy)' }}
        >
          ✅ Combat enregistré contre <strong>{savedFight.opponent.name}</strong>.
        </div>
      )}
      {error && (
        <div className="rounded-xl px-4 py-3 text-sm" style={{ background: '#fde7ea', color: 'var(--color-accent)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Adversaire">
          <select
            value={form.opponentId}
            onChange={(e) => update('opponentId', e.target.value)}
            disabled={locked}
            className="mt-1 w-full rounded-xl px-4 py-3 bg-white border border-black/10 outline-none disabled:opacity-60"
          >
            <option value="">Sélectionner un adversaire</option>
            {fighters.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} · {o.weight_category}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Vidéo du combat (optionnel)">
          <label
            className="mt-1 w-full rounded-xl px-4 py-3 bg-white border border-black/10 flex items-center gap-2 text-sm"
            style={{ color: form.videoFile ? 'var(--color-text)' : 'var(--color-text-muted)' }}
          >
            <VideoIcon />
            {form.videoFile?.name || 'Choisir un fichier ou filmer'}
            <input
              type="file"
              accept="video/*"
              capture="environment"
              onChange={handleFile}
              disabled={locked}
              className="hidden"
            />
          </label>
        </Field>

        <Field label="Résultat">
          <div className="mt-1 grid grid-cols-3 gap-2">
            {RESULTS.map((r) => (
              <ChoiceButton
                key={r}
                label={r}
                selected={form.result === r}
                disabled={locked}
                onClick={() => update('result', r)}
              />
            ))}
          </div>
        </Field>

        <Field label="Description">
          <div className="mt-1 grid grid-cols-2 gap-2">
            {DESCRIPTIONS.map((d) => (
              <ChoiceButton
                key={d}
                label={d}
                selected={form.description === d}
                disabled={locked}
                onClick={() => update('description', d)}
              />
            ))}
          </div>
        </Field>

        {!locked ? (
          <div className="flex flex-col gap-2.5 mt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl font-semibold text-white disabled:opacity-60"
              style={{ background: 'var(--color-navy)' }}
            >
              {submitting ? 'Enregistrement…' : 'Terminer et enregistrer le combat'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full py-3.5 rounded-xl font-semibold"
              style={{ background: '#ffffff', color: 'var(--color-accent)', border: '1.5px solid var(--color-accent)' }}
            >
              Annuler le combat
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleCancel}
            className="w-full py-3.5 rounded-xl font-semibold text-white mt-2"
            style={{ background: 'var(--color-navy)' }}
          >
            Enregistrer un nouveau combat
          </button>
        )}
      </form>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function ChoiceButton({ label, selected, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="py-2.5 rounded-xl text-sm font-semibold border disabled:opacity-60"
      style={{
        background: selected ? 'var(--color-navy)' : '#ffffff',
        color: selected ? '#ffffff' : 'var(--color-text)',
        borderColor: selected ? 'var(--color-navy)' : 'rgba(0,0,0,0.1)',
      }}
    >
      {label}
    </button>
  )
}
