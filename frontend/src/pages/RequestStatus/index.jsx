import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { requestsService } from '../../services/requests.service'
import { reportsService } from '../../services/reports.service'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../../components/ui/Avatar'
import Chat from '../../components/ui/Chat'
import StatusBadge from '../../components/ui/StatusBadge'
import { formatDate } from '../../utils/formatDate'
import { TIPOS_INCIDENTE } from '../../utils/constants'

const FLOW = ['PENDIENTE', 'ACEPTADA', 'EN_CURSO', 'FINALIZADA']
const FLOW_LABEL = { PENDIENTE: 'Pendiente', ACEPTADA: 'Aceptada', EN_CURSO: 'En curso', FINALIZADA: 'Finalizada' }

export default function RequestStatus() {
  const { id } = useParams()
  const { isTecnico } = useAuth()
  const [showReport, setShowReport] = useState(false)

  const { data: req, isLoading, refetch } = useQuery({
    queryKey: ['request', id],
    queryFn: () => requestsService.getById(id),
    refetchInterval: 30_000, // polling cada 30s
  })

  if (isLoading) return <div className="mx-auto max-w-3xl px-4 py-16 text-center text-slate-400">Cargando solicitud...</div>
  if (!req) return <div className="mx-auto max-w-3xl px-4 py-16 text-center text-slate-500">No se encontro la solicitud.</div>

  const currentIdx = FLOW.indexOf(req.estado)
  const cancelada = req.estado === 'CANCELADA'

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Solicitud {req.codigoReferencia}</h1>
          <p className="text-sm text-slate-500">Creada el {formatDate(req.createdAt)}</p>
        </div>
        <StatusBadge estado={req.estado} />
      </div>

      {/* Progress */}
      <div className="card mt-6 p-6">
        {cancelada ? (
          <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">Esta solicitud fue cancelada.</div>
        ) : (
          <ol className="flex items-center">
            {FLOW.map((estado, idx) => {
              const done = idx <= currentIdx
              const isLast = idx === FLOW.length - 1
              return (
                <li key={estado} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
                  <div className="flex flex-col items-center">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                      done ? 'bg-green-800 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {done ? '✓' : idx + 1}
                    </span>
                    <span className={`mt-1 text-xs ${idx === currentIdx ? 'font-semibold text-green-800' : 'text-slate-500'}`}>
                      {FLOW_LABEL[estado]}
                    </span>
                  </div>
                  {!isLast && <div className={`mx-2 h-0.5 flex-1 ${idx < currentIdx ? 'bg-green-800' : 'bg-slate-200'}`} />}
                </li>
              )
            })}
          </ol>
        )}
      </div>

      {/* Detalles */}
      <div className="card mt-6 p-6">
        <h3 className="font-semibold text-slate-800">Detalle del servicio</h3>
        <dl className="mt-3 space-y-2 text-sm">
          <Row label="Tipo" value={req.tipoServicio} />
          <Row label="Descripcion" value={req.descripcion} />
          <Row label="Direccion" value={`${req.direccion}, ${req.distrito}`} />
          <Row label="Fecha preferida" value={`${formatDate(req.fechaPreferida)} ${req.horaPreferida}`} />
        </dl>
      </div>

      {/* Contraparte: el cliente ve al tecnico; el tecnico ve al cliente */}
      <div className="card mt-6 flex items-center gap-4 p-6">
        {isTecnico ? (
          <>
            <Avatar nombre={req.clienteNombre} size="md" />
            <div className="flex-1">
              <p className="font-semibold text-slate-800">{req.clienteNombre}</p>
              <p className="text-sm text-slate-500">Cliente</p>
            </div>
          </>
        ) : (
          <>
            <Avatar nombre={req.tecnicoNombre} fotoUrl={req.tecnicoFotoUrl} size="md" />
            <div className="flex-1">
              <p className="font-semibold text-slate-800">{req.tecnicoNombre}</p>
              <p className="text-sm text-slate-500">Telefono: {req.tecnicoTelefono}</p>
            </div>
            <button className="btn-secondary" onClick={() => setShowReport(true)}>Reportar problema</button>
          </>
        )}
      </div>

      {/* Chat cliente <-> tecnico */}
      <div className="mt-6">
        <Chat requestId={req.id} />
      </div>

      {showReport && (
        <ReportModal requestId={req.id} onClose={() => { setShowReport(false); refetch() }} />
      )}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 py-1.5">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-slate-700">{value}</dd>
    </div>
  )
}

function ReportModal({ requestId, onClose }) {
  const [tipoIncidente, setTipo] = useState('')
  const [descripcion, setDesc] = useState('')
  const [done, setDone] = useState(false)

  const mutation = useMutation({
    mutationFn: () => reportsService.create({ requestId, tipoIncidente, descripcion }),
    onSuccess: () => setDone(true),
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md card p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Reportar problema</h3>
          <button onClick={onClose} className="text-slate-400">✕</button>
        </div>

        {done ? (
          <div className="mt-4 rounded-lg bg-green-50 px-3 py-6 text-center text-sm text-green-800">
            Tu reporte fue enviado. Te contactaremos pronto.
            <button onClick={onClose} className="btn-primary mt-4 w-full">Cerrar</button>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div>
              <label className="label">Tipo de incidente</label>
              <select className="input" value={tipoIncidente} onChange={(e) => setTipo(e.target.value)}>
                <option value="">Selecciona...</option>
                {TIPOS_INCIDENTE.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Descripcion</label>
              <textarea rows={3} className="input" value={descripcion} onChange={(e) => setDesc(e.target.value)} />
            </div>
            {mutation.isError && <p className="text-sm text-rose-600">No se pudo enviar el reporte.</p>}
            <button className="btn-primary w-full" disabled={!tipoIncidente || !descripcion || mutation.isPending}
              onClick={() => mutation.mutate()}>
              {mutation.isPending ? 'Enviando...' : 'Enviar reporte'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
