import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { requestsService } from '../../services/requests.service'
import { notificationsService } from '../../services/notifications.service'
import { favoritesService } from '../../services/favorites.service'
import { reviewsService } from '../../services/reviews.service'
import { useAuth } from '../../hooks/useAuth'
import StatusBadge from '../../components/ui/StatusBadge'
import StarRating from '../../components/ui/StarRating'
import StatsPanel from '../../components/ui/StatsPanel'
import NotificationItem from '../../components/ui/NotificationItem'
import { formatDate } from '../../utils/formatDate'

const ACTIVAS = ['PENDIENTE', 'ACEPTADA', 'EN_CURSO']
const HISTORIAL = ['FINALIZADA', 'CANCELADA']

export default function ClientDashboard() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [tab, setTab] = useState('solicitudes')
  const [reviewFor, setReviewFor] = useState(null)

  const { data: requests = [] } = useQuery({ queryKey: ['requests', 'my'], queryFn: requestsService.my })
  const { data: notifications = [] } = useQuery({ queryKey: ['notifications', 'my'], queryFn: notificationsService.my })
  const { data: favorites = [] } = useQuery({ queryKey: ['favorites', 'my'], queryFn: favoritesService.my })
  const { data: stats } = useQuery({
    queryKey: ['requests', 'stats'],
    queryFn: requestsService.stats,
    enabled: tab === 'estadisticas',
  })

  const markAll = useMutation({
    mutationFn: notificationsService.markAllRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', 'my'] }),
  })

  const activas = requests.filter((r) => ACTIVAS.includes(r.estado))
  const historial = requests.filter((r) => HISTORIAL.includes(r.estado))
  const completadas = requests.filter((r) => r.estado === 'FINALIZADA').length

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hola, {user?.nombre} 👋</h1>
          <p className="text-sm text-slate-500">Este es tu panel de solicitudes.</p>
        </div>
        <Link to="/buscar" className="btn-primary">Nueva solicitud</Link>
      </div>

      {/* Metricas */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Metric label="Solicitudes activas" value={activas.length} />
        <Metric label="Servicios completados" value={completadas} />
        <Metric label="Tecnicos favoritos" value={favorites.length} />
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-2 border-b border-slate-200">
        <TabButton active={tab === 'solicitudes'} onClick={() => setTab('solicitudes')}>Solicitudes</TabButton>
        <TabButton active={tab === 'historial'} onClick={() => setTab('historial')}>Historial</TabButton>
        <TabButton active={tab === 'estadisticas'} onClick={() => setTab('estadisticas')}>Estadisticas</TabButton>
      </div>

      {tab === 'solicitudes' && (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          {/* Tabla de solicitudes activas */}
          <div className="card overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-slate-800">Solicitudes activas</h2>
            </div>
            {activas.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">No tienes solicitudes activas.</div>
            ) : (
              <RequestTable rows={activas} onReview={setReviewFor} />
            )}
          </div>

          {/* Notificaciones */}
          <aside className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-800">Notificaciones</h2>
              <button onClick={() => markAll.mutate()} disabled={markAll.isPending}
                className="text-xs font-medium text-green-700 hover:underline">
                Marcar leidas
              </button>
            </div>
            <div className="mt-4 space-y-2">
              {notifications.length === 0 ? (
                <p className="text-sm text-slate-400">Sin notificaciones.</p>
              ) : (
                notifications.slice(0, 5).map((n) => <NotificationItem key={n.id} notification={n} />)
              )}
            </div>
          </aside>
        </div>
      )}

      {tab === 'historial' && (
        <div className="card mt-6 overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-800">Historial de servicios</h2>
          </div>
          {historial.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">Aun no tienes servicios finalizados o cancelados.</div>
          ) : (
            <RequestTable rows={historial} onReview={setReviewFor} showFecha />
          )}
        </div>
      )}

      {tab === 'estadisticas' && <StatsPanel stats={stats} esTecnico={false} />}

      {reviewFor && (
        <ReviewModal request={reviewFor} onClose={() => setReviewFor(null)}
          onDone={() => {
            setReviewFor(null)
            queryClient.invalidateQueries({ queryKey: ['requests', 'my'] })
          }} />
      )}
    </div>
  )
}

function RequestTable({ rows, onReview, showFecha }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Codigo</th>
            <th className="px-4 py-3">Tecnico</th>
            <th className="px-4 py-3">Servicio</th>
            {showFecha && <th className="px-4 py-3">Fecha</th>}
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-slate-100">
              <td className="px-4 py-3 font-medium text-slate-700">{r.codigoReferencia}</td>
              <td className="px-4 py-3 text-slate-600">{r.tecnicoNombre}</td>
              <td className="px-4 py-3 text-slate-600">{r.tipoServicio}</td>
              {showFecha && <td className="px-4 py-3 text-slate-500">{formatDate(r.updatedAt)}</td>}
              <td className="px-4 py-3"><StatusBadge estado={r.estado} /></td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Link to={`/solicitud/${r.id}`} className="text-green-700 hover:underline">Ver</Link>
                  {r.estado === 'FINALIZADA' && !r.tieneResena && (
                    <button onClick={() => onReview(r)} className="text-amber-600 hover:underline">Resenar</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TabButton({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
        active ? 'border-green-700 text-green-800' : 'border-transparent text-slate-500 hover:text-slate-700'
      }`}>
      {children}
    </button>
  )
}

function Metric({ label, value }) {
  return (
    <div className="card p-5">
      <p className="text-3xl font-bold text-green-800">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  )
}

function ReviewModal({ request, onClose, onDone }) {
  const [estrellas, setEstrellas] = useState(5)
  const [comentario, setComentario] = useState('')

  const mutation = useMutation({
    mutationFn: () => reviewsService.create({ requestId: request.id, estrellas, comentario }),
    onSuccess: onDone,
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md card p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Resenar a {request.tecnicoNombre}</h3>
          <button onClick={onClose} className="text-slate-400">✕</button>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <label className="label">Calificacion</label>
            <StarRating value={estrellas} interactive onChange={setEstrellas} size="lg" />
          </div>
          <div>
            <label className="label">Comentario</label>
            <textarea rows={3} className="input" value={comentario} onChange={(e) => setComentario(e.target.value)}
              placeholder="Cuenta como fue tu experiencia..." />
          </div>
          {mutation.isError && <p className="text-sm text-rose-600">
            {mutation.error?.response?.data?.message || 'No se pudo enviar la resena.'}</p>}
          <button className="btn-primary w-full" disabled={mutation.isPending} onClick={() => mutation.mutate()}>
            {mutation.isPending ? 'Enviando...' : 'Enviar resena'}
          </button>
        </div>
      </div>
    </div>
  )
}
