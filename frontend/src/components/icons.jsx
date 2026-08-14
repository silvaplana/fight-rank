// Minimal hand-rolled stroke icons (no external icon library needed for the mockup).

const common = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function FightIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...common} {...props}>
      <path d="M4 12h3l2-3 3 6 2-4h3" />
      <circle cx="4" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="20" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function RankingsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...common} {...props}>
      <path d="M4 20V13" />
      <path d="M10 20V8" />
      <path d="M16 20V4" />
    </svg>
  )
}

export function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...common} {...props}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  )
}

export function ChevronRightIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...common} {...props}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

export function VideoIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...common} {...props}>
      <rect x="3" y="6" width="12" height="12" rx="2" />
      <path d="M15 10l6-3v10l-6-3" />
    </svg>
  )
}
