const STYLES = {
  PENDIENTE: 'bg-amber-100 text-amber-800',
  ACEPTADA: 'bg-blue-100 text-blue-700',
  EN_CURSO: 'bg-purple-100 text-purple-700',
  FINALIZADA: 'bg-green-100 text-green-800',
  CANCELADA: 'bg-rose-100 text-rose-700',
}

const LABELS = {
  PENDIENTE: 'Pendiente',
  ACEPTADA: 'Aceptada',
  EN_CURSO: 'En curso',
  FINALIZADA: 'Finalizada',
  CANCELADA: 'Cancelada',
}

export default function StatusBadge({ estado }) {
  const style = STYLES[estado] || 'bg-slate-100 text-slate-600'
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${style}`}>
      {LABELS[estado] || estado}
    </span>
  )
}
