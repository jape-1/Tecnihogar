import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { requestsService } from '../../services/requests.service'
import { techniciansService } from '../../services/technicians.service'
import { reviewsService } from '../../services/reviews.service'
import { useAuth } from '../../hooks/useAuth'
import StatusBadge from '../../components/ui/StatusBadge'
import StarRating from '../../components/ui/StarRating'
import Avatar from '../../components/ui/Avatar'
import { formatDate } from '../../utils/formatDate'

export default function TechnicianDashboard() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: profile } = useQuery({ queryKey: ['technicians', 'me'], queryFn: techniciansService.getMe })
  const { data: incoming = [] } = useQuery({ queryKey: ['requests', 'incoming'], queryFn: requestsService.incoming })
  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', 'technician', profile?.id],
    queryFn: () => reviewsService.byTechnician(profile.id),
    enabled: !!profile?.id,
  })

  const availability = useMutation({
    mutationFn: (disponible) => techniciansService.setAvailability(disponible),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['technicians', 'me'] }),
  })

  const status = useMutation({
    mutationFn: ({ id, estado }) => requestsService.updateStatus(id, estado),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['requests', 'incoming'] }),
  })

  const nuevas = incoming.filter((r) => r.estado === 'PENDIENTE').length
  const completadas = incoming.filter((r) => r.estado === 'FINALIZADA').length

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hola, {user?.nombre} 👋</h1>
          <p className="text-sm text-slate-500">Gestiona tus solicitudes y tu perfil.</p>
        </div>
        {profile && (
          <label className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2">
            <span className="text-sm font-medium text-slate-600">
              {profile.disponible ? 'Disponible' : 'No disponible'}
            </span>
            <button
              onClick={() => availability.mutate(!profile.disponible)}
              className={`relative h-6 w-11 rounded-full transition ${profile.disponible ? 'bg-green-700' : 'bg-slate-300'}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${profile.disponible ? 'left-5' : 'left-0.5'}`} />
            </button>
          </label>
        )}
      </div>

      {/* Completitud del perfil */}
      {profile && (
        <div className="card mt-6 p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">Completitud del perfil</span>
            <span className="text-slate-500">{profile.perfilCompletitud}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-green-700" style={{ width: `${profile.perfilCompletitud}%` }} />
          </div>
        </div>
      )}

      {/* Metricas */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Metric label="Solicitudes nuevas" value={nuevas} />
        <Metric label="Servicios completados" value={completadas} />
        <Metric label="Calificacion promedio" value={profile ? Number(profile.ratingPromedio).toFixed(1) : '-'} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        {/* Solicitudes entrantes */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800">Solicitudes entrantes</h2>
          <div className="mt-4 space-y-3">
            {incoming.length === 0 ? (
              <p className="text-sm text-slate-400">No tienes solicitudes.</p>
            ) : (
              incoming.map((r) => (
                <div key={r.id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-slate-800">{r.tipoServicio}</p>
                      <p className="text-xs text-slate-500">{r.codigoReferencia} · {r.clienteNombre}</p>
                    </div>
                    <StatusBadge estado={r.estado} />
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{r.descripcion}</p>
                  <p className="mt-1 text-xs text-slate-400">{r.distrito} · {formatDate(r.fechaPreferida)} {r.horaPreferida}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {r.estado === 'PENDIENTE' && (
                      <>
                        <button className="btn-primary" disabled={status.isPending}
                          onClick={() => status.mutate({ id: r.id, estado: 'ACEPTADA' })}>Aceptar</button>
                        <button className="btn-secondary" disabled={status.isPending}
                          onClick={() => status.mutate({ id: r.id, estado: 'CANCELADA' })}>Rechazar</button>
                      </>
                    )}
                    {r.estado === 'ACEPTADA' && (
                      <button className="btn-primary" disabled={status.isPending}
                        onClick={() => status.mutate({ id: r.id, estado: 'EN_CURSO' })}>Iniciar servicio</button>
                    )}
                    {r.estado === 'EN_CURSO' && (
                      <button className="btn-primary" disabled={status.isPending}
                        onClick={() => status.mutate({ id: r.id, estado: 'FINALIZADA' })}>Marcar finalizada</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Resenas */}
        <aside className="card p-5">
          <h2 className="font-semibold text-slate-800">Resenas recientes</h2>
          <div className="mt-4 space-y-4">
            {reviews.length === 0 ? (
              <p className="text-sm text-slate-400">Aun no tienes resenas.</p>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="flex gap-3 border-b border-slate-100 pb-3 last:border-0">
                  <Avatar nombre={r.clienteNombre} size="sm" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-700">{r.clienteNombre}</span>
                      <StarRating value={r.estrellas} />
                    </div>
                    <p className="text-sm text-slate-600">{r.comentario}</p>
                    <p className="text-xs text-slate-400">{formatDate(r.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
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
