export default function StarRating({ value = 0, count, size = 'sm', interactive = false, onChange }) {
  const rounded = Math.round(value)
  const starClass = size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-lg' : 'text-sm'

  return (
    <div className="flex items-center gap-1">
      <div className={`flex ${starClass}`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(i)}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} ${
              i <= (interactive ? value : rounded) ? 'text-amber-400' : 'text-slate-300'
            }`}
            aria-label={`${i} estrellas`}
          >
            &#9733;
          </button>
        ))}
      </div>
      {value != null && !interactive && (
        <span className="text-sm font-semibold text-slate-700">{Number(value).toFixed(1)}</span>
      )}
      {count != null && <span className="text-xs text-slate-400">({count})</span>}
    </div>
  )
}
