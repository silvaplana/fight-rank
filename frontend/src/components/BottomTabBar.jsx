export default function BottomTabBar({ tabs, active, onChange }) {
  return (
    <nav
      className="sticky bottom-0 left-0 right-0 flex items-stretch justify-around bg-white border-t border-black/5"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === active
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className="flex-1 flex flex-col items-center gap-1 py-2.5"
          >
            <span
              className="flex items-center justify-center w-9 h-7 rounded-full transition-colors"
              style={{
                backgroundColor: isActive ? 'var(--color-navy)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--color-text-muted)',
              }}
            >
              <tab.icon />
            </span>
            <span
              className="text-[11px] font-medium"
              style={{ color: isActive ? 'var(--color-navy)' : 'var(--color-text-muted)' }}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
