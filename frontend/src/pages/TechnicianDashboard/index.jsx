import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { requestsService } from '../../services/requests.service'
import { techniciansService } from '../../services/technicians.service'
import { reviewsService } from '../../services/reviews.service'
import { useAuth } from '../../hooks/useAuth'
import StatusBadge from '../../components/ui/StatusBadge'
import StarRating from '../../components/ui/StarRating'
import StatsPanel from '../../components/ui/StatsPanel'
import Avatar from '../../components/ui/Avatar'
import { formatDate } from '../../utils/formatDate'
import { ESPECIALIDADES, DISTRITOS_LIMA } from '../../utils/constants'

const ACTIVAS = ['PENDIENTE', 'ACEPTADA', 'EN_CURSO']
const HISTORIAL = ['FINALIZADA', 'CANCELADA']

export default function TechnicianDashboard() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [tab, setTab] = useState('solicitudes')

  const { data: profile } = useQuery({ queryKey: ['technicians', 'me'], queryFn: techniciansService.getMe })
  const { data: incoming = [] } = useQuery({ queryKey: ['requests', 'incoming'], queryFn: requestsService.incoming })
  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', 'technician', profile?.id],
    queryFn: () => reviewsService.byTechnician(profile.id),
    enabled: !!profile?.id,
  })
  const { data: stats } = useQuery({
    queryKey: ['requests', 'stats'],
    queryFn: requestsService.stats,
    enabled: tab === 'estadisticas',
  })

  const availability = useMutation({
    mutationFn: (disponible) => techniciansService.setAvailability(disponible),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['technicians', 'me'] }),
  })
  const status = useMutation({
    mutationFn: ({ id, estado }) => requestsService.updateStatus(id, estado),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['requests', 'incoming'] }),
  })

  const activas = incoming.filter((r) => ACTIVAS.includes(r.estado))
  const historial = incoming.filter((r) => HISTORIAL.includes(r.estado))
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
            <button onClick={() => availability.mutate(!profile.disponible)}
              className={`relative h-6 w-11 rounded-full transition ${profile.disponible ? 'bg-green-700' : 'bg-slate-300'}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${profile.disponible ? 'left-5' : 'left-0.5'}`} />
            </button>
          </label>
        )}
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-2 border-b border-slate-200">
        <TabButton active={tab === 'solicitudes'} onClick={() => setTab('solicitudes')}>Solicitudes</TabButton>
        <TabButton active={tab === 'historial'} onClick={() => setTab('historial')}>Historial</TabButton>
        <TabButton active={tab === 'estadisticas'} onClick={() => setTab('estadisticas')}>Estadisticas</TabButton>
        <TabButton active={tab === 'perfil'} onClick={() => setTab('perfil')}>Mi perfil</TabButton>
      </div>

      {tab === 'solicitudes' && (
        <RequestsTab profile={profile} incoming={activas} reviews={reviews} nuevas={nuevas}
          completadas={completadas} status={status} />
      )}
      {tab === 'historial' && <HistorialTab historial={historial} />}
      {tab === 'estadisticas' && <StatsPanel stats={stats} esTecnico={true} />}
      {tab === 'perfil' && profile && <ProfileTab profile={profile} />}
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

/* ---------------- Solicitudes ---------------- */
function RequestsTab({ profile, incoming, reviews, nuevas, completadas, status }) {
  return (
    <>
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

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Metric label="Solicitudes nuevas" value={nuevas} />
        <Metric label="Servicios completados" value={completadas} />
        <Metric label="Calificacion promedio" value={profile ? Number(profile.ratingPromedio).toFixed(1) : '-'} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
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
                  <p className="mt-1 text-xs text-slate-400">{r.direccion}, {r.distrito} · {formatDate(r.fechaPreferida)} {r.horaPreferida}</p>
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
                    <Link to={`/solicitud/${r.id}`} className="btn-secondary">Ver / Chat</Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

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
    </>
  )
}

/* ---------------- Historial ---------------- */
function HistorialTab({ historial }) {
  return (
    <div className="card mt-6 overflow-hidden">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-semibold text-slate-800">Servicios finalizados y cancelados</h2>
      </div>
      {historial.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-400">Aun no tienes servicios en el historial.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Codigo</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Servicio</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {historial.map((r) => (
                <tr key={r.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-700">{r.codigoReferencia}</td>
                  <td className="px-4 py-3 text-slate-600">{r.clienteNombre}</td>
                  <td className="px-4 py-3 text-slate-600">{r.tipoServicio}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(r.updatedAt)}</td>
                  <td className="px-4 py-3"><StatusBadge estado={r.estado} /></td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/solicitud/${r.id}`} className="text-green-700 hover:underline">Ver</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/* ---------------- Mi perfil ---------------- */
function ProfileTab({ profile }) {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['technicians', 'me'] })

  const [data, setData] = useState({
    nombre: profile.nombre || '',
    telefono: profile.telefono || '',
    especialidad: profile.especialidad || 'GASFITERIA',
    experienciaAnios: profile.experienciaAnios ?? '',
    tarifaDesde: profile.tarifaDesde ?? '',
    tiempoRespuesta: profile.tiempoRespuesta || '',
    garantiaDias: profile.garantiaDias ?? '',
    bio: profile.bio || '',
  })
  const [zonas, setZonas] = useState(profile.zonas || [])
  const [savedMsg, setSavedMsg] = useState('')
  const [workDesc, setWorkDesc] = useState('')

  const set = (k, v) => setData({ ...data, [k]: v })
  const toggleZona = (d) => setZonas((p) => (p.includes(d) ? p.filter((x) => x !== d) : [...p, d]))
  const flash = (m) => { setSavedMsg(m); setTimeout(() => setSavedMsg(''), 2500) }

  const saveData = useMutation({
    mutationFn: () => techniciansService.updateMe({
      nombre: data.nombre,
      telefono: data.telefono,
      especialidad: data.especialidad,
      experienciaAnios: data.experienciaAnios === '' ? null : Number(data.experienciaAnios),
      tarifaDesde: data.tarifaDesde === '' ? null : Number(data.tarifaDesde),
      tiempoRespuesta: data.tiempoRespuesta,
      garantiaDias: data.garantiaDias === '' ? null : Number(data.garantiaDias),
      bio: data.bio,
    }),
    onSuccess: () => { invalidate(); flash('Datos guardados ✓') },
  })

  const saveZones = useMutation({
    mutationFn: () => techniciansService.updateZones(zonas),
    onSuccess: () => { invalidate(); flash('Zonas actualizadas ✓') },
  })

  const uploadPhoto = useMutation({
    mutationFn: (file) => techniciansService.uploadPhoto(file),
    onSuccess: () => { invalidate(); flash('Foto actualizada ✓') },
  })

  const addWork = useMutation({
    mutationFn: (file) => techniciansService.addWork(file, workDesc),
    onSuccess: () => { setWorkDesc(''); invalidate(); flash('Trabajo agregado ✓') },
  })

  const deleteWork = useMutation({
    mutationFn: (id) => techniciansService.deleteWork(id),
    onSuccess: () => { invalidate(); flash('Trabajo eliminado ✓') },
  })

  return (
    <div className="mt-6 space-y-6">
      {savedMsg && <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">{savedMsg}</div>}

      {/* Foto de perfil */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-800">Foto de perfil</h2>
        <div className="mt-4 flex items-center gap-4">
          <Avatar nombre={profile.nombre} fotoUrl={profile.fotoUrl} size="lg" />
          <label className="btn-secondary cursor-pointer">
            {uploadPhoto.isPending ? 'Subiendo...' : 'Cambiar foto'}
            <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPhoto.mutate(f); e.target.value = '' }} />
          </label>
        </div>
        {uploadPhoto.isError && <p className="mt-2 text-sm text-rose-600">No se pudo subir (verifica credenciales de Cloudinary).</p>}
      </div>

      {/* Datos personales */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-800">Datos personales</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <F label="Nombre"><input className="input" value={data.nombre} onChange={(e) => set('nombre', e.target.value)} /></F>
          <F label="Telefono"><input className="input" value={data.telefono} onChange={(e) => set('telefono', e.target.value)} placeholder="+51 987 654 321" /></F>
          <F label="Especialidad">
            <select className="input" value={data.especialidad} onChange={(e) => set('especialidad', e.target.value)}>
              {ESPECIALIDADES.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </F>
          <F label="Anios de experiencia"><input type="number" min="0" className="input" value={data.experienciaAnios} onChange={(e) => set('experienciaAnios', e.target.value)} /></F>
          <F label="Tarifa desde (S/)"><input type="number" min="0" className="input" value={data.tarifaDesde} onChange={(e) => set('tarifaDesde', e.target.value)} /></F>
          <F label="Tiempo de respuesta"><input className="input" value={data.tiempoRespuesta} onChange={(e) => set('tiempoRespuesta', e.target.value)} placeholder="~20 min" /></F>
          <F label="Garantia (dias)"><input type="number" min="0" className="input" value={data.garantiaDias} onChange={(e) => set('garantiaDias', e.target.value)} /></F>
        </div>
        <div className="mt-4">
          <F label="Bio"><textarea rows={3} className="input" value={data.bio} onChange={(e) => set('bio', e.target.value)} /></F>
        </div>
        <button className="btn-primary mt-4" disabled={saveData.isPending} onClick={() => saveData.mutate()}>
          {saveData.isPending ? 'Guardando...' : 'Guardar datos'}
        </button>
      </div>

      {/* Zonas */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-800">Zonas de atencion</h2>
        <div className="mt-4 grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4">
          {DISTRITOS_LIMA.map((d) => (
            <label key={d} className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-green-700 focus:ring-green-600"
                checked={zonas.includes(d)} onChange={() => toggleZona(d)} />
              {d}
            </label>
          ))}
        </div>
        <button className="btn-primary mt-4" disabled={saveZones.isPending} onClick={() => saveZones.mutate()}>
          {saveZones.isPending ? 'Guardando...' : 'Guardar zonas'}
        </button>
      </div>

      {/* Galeria de trabajos */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-800">Galeria de trabajos</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {(profile.works || []).map((w) => (
            <div key={w.id} className="group relative overflow-hidden rounded-lg border border-slate-200">
              <img src={w.imagenUrl} alt={w.descripcion} className="h-28 w-full object-cover" />
              <button onClick={() => deleteWork.mutate(w.id)} disabled={deleteWork.isPending}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-rose-600"
                title="Eliminar">✕</button>
              {w.descripcion && <p className="px-2 py-1 text-xs text-slate-500">{w.descripcion}</p>}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <input className="input sm:flex-1" placeholder="Descripcion (opcional)" value={workDesc} onChange={(e) => setWorkDesc(e.target.value)} />
          <label className="btn-secondary cursor-pointer whitespace-nowrap">
            {addWork.isPending ? 'Subiendo...' : '+ Anadir foto de trabajo'}
            <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) addWork.mutate(f); e.target.value = '' }} />
          </label>
        </div>
      </div>
    </div>
  )
}

function F({ label, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
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
