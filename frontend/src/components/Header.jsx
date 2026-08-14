export default function Header({ title, subtitle, initials, onAvatarClick }) {
  return (
    <header
      className="px-5 pt-6 pb-5 flex items-center justify-between"
      style={{
        paddingTop: 'calc(var(--safe-top) + 20px)',
        background: 'linear-gradient(135deg, #f4e9ec 0%, #eaeef6 55%, #e7ecf5 100%)',
      }}
    >
      <div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--color-navy)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {initials && (
        <button
          onClick={onAvatarClick}
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
          style={{
            background: '#ffffff',
            color: 'var(--color-navy)',
            border: '2px solid var(--color-accent)',
          }}
        >
          {initials}
        </button>
      )}
    </header>
  )
}
