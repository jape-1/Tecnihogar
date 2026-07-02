import { formatDateTime } from '../../utils/formatDate'

export default function NotificationItem({ notification }) {
  const { mensaje, leida, createdAt } = notification
  return (
    <div className={`flex gap-3 rounded-lg border p-3 ${leida ? 'border-slate-200 bg-white' : 'border-green-200 bg-green-50'}`}>
      <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${leida ? 'bg-slate-300' : 'bg-green-600'}`} />
      <div className="min-w-0">
        <p className="text-sm text-slate-700">{mensaje}</p>
        <p className="mt-0.5 text-xs text-slate-400">{formatDateTime(createdAt)}</p>
      </div>
    </div>
  )
}
