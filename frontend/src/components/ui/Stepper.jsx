export default function Stepper({ steps, current }) {
  return (
    <ol className="flex items-center w-full">
      {steps.map((label, idx) => {
        const active = idx === current
        const done = idx < current
        const isLast = idx === steps.length - 1
        return (
          <li key={label} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
            <div className="flex flex-col items-center">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                  done ? 'bg-green-800 text-white'
                    : active ? 'bg-green-100 text-green-800 ring-2 ring-green-800'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {done ? '✓' : idx + 1}
              </span>
              <span className={`mt-1 text-xs ${active ? 'font-semibold text-green-800' : 'text-slate-500'}`}>
                {label}
              </span>
            </div>
            {!isLast && (
              <div className={`mx-2 h-0.5 flex-1 ${done ? 'bg-green-800' : 'bg-slate-200'}`} />
            )}
          </li>
        )
      })}
    </ol>
  )
}
