import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTechnician } from '../../hooks/useTechnicians'
import { requestsService } from '../../services/requests.service'
import Stepper from '../../components/ui/Stepper'
import Avatar from '../../components/ui/Avatar'
import { TIPOS_SERVICIO, TIPOS_SERVICIO_POR_ESP, DISTRITOS_LIMA } from '../../utils/constants'

const STEPS = ['Servicio', 'Detalles', 'Confirmar']

function tomorrowISO() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

export default function ServiceRequest() {
  const { technicianId } = useParams()
  const navigate = useNavigate()
  const { data: tecnico } = useTechnician(technicianId)

  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    tipoServicio: '', descripcion: '',
    direccion: '', distrito: '', fechaPreferida: '', horaPreferida: '',
  })

  const set = (k, v) => setForm({ ...form, [k]: v })
  const minDate = tomorrowISO()

  const tipos = useMemo(
    () => (tecnico?.especialidad && TIPOS_SERVICIO_POR_ESP[tecnico.especialidad]) || TIPOS_SERVICIO,
    [tecnico],
  )

  // Validaciones por paso
  const descripcionOk = form.descripcion.trim().length >= 20
  const horaOk = form.horaPreferida >= '08:00' && form.horaPreferida <= '20:00'
  const fechaOk = form.fechaPreferida && form.fechaPreferida >= minDate

  const step1Ok = form.tipoServicio && descripcionOk
  const step2Ok = form.direccion.trim() && form.distrito && fechaOk && horaOk
  const canNext = (step === 0 && step1Ok) || (step === 1 && step2Ok)

  const submit = async () => {
    setError('')
    setSubmitting(true)
    try {
      const created = await requestsService.create({ tecnicoId: Number(technicianId), ...form })
      navigate(`/solicitud/${created.id}`, { state: { message: 'Solicitud enviada correctamente' } })
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo crear la solicitud')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <div className="card p-6">
          <Stepper steps={STEPS} current={step} />

          {error && <div className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

          <div className="mt-6">
            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="label">Tipo de servicio</label>
                  <select className="input" value={form.tipoServicio} onChange={(e) => set('tipoServicio', e.target.value)}>
                    <option value="">Selecciona...</option>
                    {tipos.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Descripcion del problema</label>
                  <textarea rows={4} className="input" value={form.descripcion}
                    onChange={(e) => set('descripcion', e.target.value)}
                    placeholder="Describe lo que necesitas (minimo 20 caracteres)..." />
                  <p className={`mt-1 text-xs ${descripcionOk ? 'text-slate-400' : 'text-rose-500'}`}>
                    {form.descripcion.trim().length}/20 caracteres minimos
                  </p>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="label">Direccion</label>
                  <input className="input" value={form.direccion} onChange={(e) => set('direccion', e.target.value)}
                    placeholder="Av. Ejemplo 123, Dpto 4" />
                </div>
                <div>
                  <label className="label">Distrito</label>
                  <select className="input" value={form.distrito} onChange={(e) => set('distrito', e.target.value)}>
                    <option value="">Selecciona...</option>
                    {DISTRITOS_LIMA.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Fecha preferida</label>
                    <input type="date" min={minDate} className="input" value={form.fechaPreferida}
                      onChange={(e) => set('fechaPreferida', e.target.value)} />
                    {form.fechaPreferida && !fechaOk && <p className="mt-1 text-xs text-rose-500">Debe ser desde manana</p>}
                  </div>
                  <div>
                    <label className="label">Hora (08:00-20:00)</label>
                    <input type="time" min="08:00" max="20:00" className="input" value={form.horaPreferida}
                      onChange={(e) => set('horaPreferida', e.target.value)} />
                    {form.horaPreferida && !horaOk && <p className="mt-1 text-xs text-rose-500">Fuera del rango 08:00-20:00</p>}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3 text-sm">
                <h3 className="text-base font-semibold text-slate-800">Resumen de tu solicitud</h3>
                <Row label="Tecnico" value={tecnico?.nombre} />
                <Row label="Tipo de servicio" value={form.tipoServicio} />
                <Row label="Descripcion" value={form.descripcion} />
                <Row label="Direccion" value={`${form.direccion}, ${form.distrito}`} />
                <Row label="Fecha y hora" value={`${form.fechaPreferida} ${form.horaPreferida}`} />
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-between">
            <button className="btn-ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Atras</button>
            {step < 2 ? (
              <button className="btn-primary" disabled={!canNext} onClick={() => setStep((s) => s + 1)}>Continuar</button>
            ) : (
              <button className="btn-primary" disabled={submitting} onClick={submit}>
                {submitting ? 'Enviando...' : 'Confirmar y enviar solicitud'}
              </button>
            )}
          </div>
        </div>

        {/* Panel tecnico */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="card p-5 text-center">
            {tecnico ? (
              <>
                <div className="flex justify-center"><Avatar nombre={tecnico.nombre} fotoUrl={tecnico.fotoUrl} size="lg" /></div>
                <p className="mt-3 font-semibold text-slate-800">{tecnico.nombre}</p>
                <p className="text-sm text-slate-500">{tecnico.especialidad}</p>
                <p className="mt-2 text-sm text-slate-500">Desde <b>S/ {tecnico.tarifaDesde}</b></p>
              </>
            ) : <p className="text-sm text-slate-400">Cargando tecnico...</p>}
          </div>
        </aside>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 py-1.5">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-700">{value}</span>
    </div>
  )
}
