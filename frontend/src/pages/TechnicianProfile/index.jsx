import { useParams, useNavigate } from 'react-router-dom'
import { useTechnician } from '../../hooks/useTechnicians'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../../components/ui/Avatar'
import StarRating from '../../components/ui/StarRating'
import { formatDate } from '../../utils/formatDate'

export default function TechnicianProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { data: t, isLoading, isError } = useTechnician(id)

  const handleSolicitar = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnTo: `/solicitar/${id}` } })
    } else {
      navigate(`/solicitar/${id}`)
    }
  }

  if (isLoading) return <div className="mx-auto max-w-5xl px-4 py-16 text-center text-slate-400">Cargando perfil...</div>
  if (isError || !t) return <div className="mx-auto max-w-5xl px-4 py-16 text-center text-slate-500">No se encontro el tecnico.</div>

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Columna principal */}
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <Avatar nombre={t.nombre} fotoUrl={t.fotoUrl} size="lg" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-800">{t.nombre}</h1>
                  {t.verificado && <span className="chip bg-blue-50 text-blue-600">✓ Verificado</span>}
                </div>
                <p className="text-slate-500">{t.especialidad} · {t.experienciaAnios} anios de experiencia</p>
                <div className="mt-2"><StarRating value={t.ratingPromedio} count={t.totalResenas} size="md" /></div>
              </div>
            </div>
            {t.bio && <p className="mt-4 text-slate-600">{t.bio}</p>}

            <div className="mt-4">
              <h3 className="text-sm font-semibold text-slate-700">Zonas de servicio</h3>
              <div className="mt-2 flex flex-wrap gap-1">
                {t.zonas.map((z) => <span key={z} className="chip">{z}</span>)}
              </div>
            </div>
          </div>

          {/* Galeria de trabajos */}
          <div className="card p-6">
            <h3 className="font-semibold text-slate-800">Trabajos realizados</h3>
            {t.works.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">Aun no hay trabajos publicados.</p>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {t.works.map((w) => (
                  <figure key={w.id} className="overflow-hidden rounded-lg border border-slate-200">
                    <img src={w.imagenUrl} alt={w.descripcion} className="h-32 w-full object-cover" loading="lazy" />
                    {w.descripcion && <figcaption className="px-2 py-1 text-xs text-slate-500">{w.descripcion}</figcaption>}
                  </figure>
                ))}
              </div>
            )}
          </div>

          {/* Resenas */}
          <div className="card p-6">
            <h3 className="font-semibold text-slate-800">Resenas ({t.resenas.length})</h3>
            {t.resenas.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">Este tecnico aun no tiene resenas.</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {t.resenas.map((r) => (
                  <li key={r.id} className="flex gap-3 border-b border-slate-100 pb-4 last:border-0">
                    <Avatar nombre={r.clienteNombre} size="sm" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-700">{r.clienteNombre}</span>
                        <StarRating value={r.estrellas} />
                      </div>
                      <p className="text-sm text-slate-600">{r.comentario}</p>
                      <p className="text-xs text-slate-400">{formatDate(r.createdAt)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Panel sticky */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="card p-6">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Tarifa desde</span><span className="font-semibold">S/ {t.tarifaDesde}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Tiempo de respuesta</span><span className="font-semibold">{t.tiempoRespuesta}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Garantia</span><span className="font-semibold">{t.garantiaDias} dias</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Estado</span>
                <span className={t.disponible ? 'font-semibold text-green-700' : 'font-semibold text-slate-400'}>
                  {t.disponible ? 'Disponible' : 'No disponible'}
                </span>
              </div>
            </div>
            <button onClick={handleSolicitar} className="btn-primary mt-5 w-full">Solicitar servicio</button>
          </div>
        </aside>
      </div>
    </div>
  )
}
