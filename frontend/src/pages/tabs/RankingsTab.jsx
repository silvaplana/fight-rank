import { useApp } from '../../context/AppContext'
import { mediaUrl } from '../../api'

const resultColor = {
  Win: 'var(--color-win)',
  Loss: 'var(--color-loss)',
  Draw: 'var(--color-draw)',
}

export default function RankingsTab() {
  const { fights } = useApp()

  return (
    <div className="px-5 pt-5 pb-6 flex flex-col gap-4">
      <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>
        Mes combats ({fights.length})
      </h2>

      {fights.length === 0 && (
        <div className="rounded-xl bg-white px-4 py-6 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Aucun combat enregistré pour l'instant.
        </div>
      )}

      <div className="flex flex-col gap-3">
        {fights.map((fight) => (
          <div key={fight.id} className="rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="px-4 py-3.5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--color-navy)' }}>
                  vs {fight.opponent.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  {fight.date} · {fight.description}
                </p>
              </div>
              <span
                className="text-xs font-bold px-3 py-1.5 rounded-full shrink-0"
                style={{ background: resultColor[fight.result] + '20', color: resultColor[fight.result] }}
              >
                {fight.result}
              </span>
            </div>

            {fight.video_url && (
              <video
                src={mediaUrl(fight.video_url)}
                controls
                playsInline
                preload="metadata"
                className="w-full block bg-black"
                style={{ maxHeight: 260 }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
