const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-24 w-24 text-2xl',
}

function initials(nombre = '') {
  const parts = nombre.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const second = parts[1]?.[0] ?? ''
  return (first + second).toUpperCase() || '?'
}

export default function Avatar({ nombre, fotoUrl, size = 'md' }) {
  const cls = SIZES[size] || SIZES.md
  if (fotoUrl) {
    return (
      <img
        src={fotoUrl}
        alt={nombre}
        className={`${cls} rounded-full object-cover ring-2 ring-white shadow-sm`}
      />
    )
  }
  return (
    <div className={`${cls} flex items-center justify-center rounded-full bg-green-800 font-semibold text-green-50`}>
      {initials(nombre)}
    </div>
  )
}
