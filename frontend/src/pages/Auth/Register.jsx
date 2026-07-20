import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../../services/auth.service'
import { ESPECIALIDADES, DISTRITOS_LIMA } from '../../utils/constants'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Register() {
  const navigate = useNavigate()
  const [rol, setRol] = useState('CLIENTE')
  const [form, setForm] = useState({
    nombre: '', email: '', password: '', confirm: '',
    especialidad: 'GASFITERIA', experienciaAnios: '', bio: '',
    tarifaDesde: '', tiempoRespuesta: '', garantiaDias: '',
  })
  const [zonas, setZonas] = useState([])
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm({ ...form, [k]: v })
  const toggleZona = (d) =>
    setZonas((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]))

  const validate = () => {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio'
    if (!EMAIL_RE.test(form.email)) e.email = 'Email invalido'
    if (form.password.length < 8) e.password = 'Minimo 8 caracteres'
    if (form.password !== form.confirm) e.confirm = 'Las contrasenas no coinciden'
    if (rol === 'TECNICO') {
      if (!form.especialidad) e.especialidad = 'Selecciona una especialidad'
      if (zonas.length === 0) e.zonas = 'Selecciona al menos una zona'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (ev) => {
    ev.preventDefault()
    setApiError('')
    if (!validate()) return
    setLoading(true)
    try {
      const payload = {
        nombre: form.nombre,
        email: form.email,
        password: form.password,
        rol,
        tecnico: rol === 'TECNICO' ? {
          especialidad: form.especialidad,
          experienciaAnios: form.experienciaAnios ? Number(form.experienciaAnios) : 0,
          bio: form.bio,
          tarifaDesde: form.tarifaDesde ? Number(form.tarifaDesde) : null,
          tiempoRespuesta: form.tiempoRespuesta,
          garantiaDias: form.garantiaDias ? Number(form.garantiaDias) : null,
          zonas,
        } : null,
      }
      await authService.register(payload)
      navigate('/login', { state: { message: 'Cuenta creada, inicia sesion' } })
    } catch (err) {
      setApiError(err.response?.data?.message || 'No se pudo completar el registro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-slate-800">Crear cuenta</h1>
        <p className="mt-1 text-sm text-slate-500">Unete a TecniHogar</p>

        {apiError && <div className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{apiError}</div>}

        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          {/* Rol */}
          <div>
            <label className="label">Quiero registrarme como</label>
            <div className="grid grid-cols-2 gap-2">
              {['CLIENTE', 'TECNICO'].map((r) => (
                <button key={r} type="button" onClick={() => setRol(r)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                    rol === r ? 'border-green-700 bg-green-50 text-green-800' : 'border-slate-300 text-slate-600'
                  }`}>
                  {r === 'CLIENTE' ? 'Cliente' : 'Tecnico'}
                </button>
              ))}
            </div>
          </div>

          <Field label="Nombre completo" error={errors.nombre}>
            <input className="input" value={form.nombre} onChange={(e) => set('nombre', e.target.value)} placeholder="Juan Perez" />
          </Field>
          <Field label="Email" error={errors.email}>
            <input type="email" className="input" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="tu@email.com" />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Contrasena" error={errors.password}>
              <input type="password" className="input" value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="Minimo 8 caracteres" />
            </Field>
            <Field label="Confirmar contrasena" error={errors.confirm}>
              <input type="password" className="input" value={form.confirm} onChange={(e) => set('confirm', e.target.value)} placeholder="Repite la contrasena" />
            </Field>
          </div>

          {/* Campos de tecnico */}
          {rol === 'TECNICO' && (
            <div className="space-y-4 rounded-lg border border-green-100 bg-green-50/40 p-4">
              <h3 className="text-sm font-semibold text-green-800">Datos del tecnico</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Especialidad" error={errors.especialidad}>
                  <select className="input" value={form.especialidad} onChange={(e) => set('especialidad', e.target.value)}>
                    {ESPECIALIDADES.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
                  </select>
                </Field>
                <Field label="Anios de experiencia">
                  <input type="number" min="0" className="input" value={form.experienciaAnios} onChange={(e) => set('experienciaAnios', e.target.value)} />
                </Field>
              </div>
              <Field label="Bio / descripcion">
                <textarea rows={3} className="input" value={form.bio} onChange={(e) => set('bio', e.target.value)} placeholder="Cuenta tu experiencia..." />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Tarifa desde (S/)">
                  <input type="number" min="0" className="input" value={form.tarifaDesde} onChange={(e) => set('tarifaDesde', e.target.value)} />
                </Field>
                <Field label="Tiempo de respuesta">
                  <input className="input" value={form.tiempoRespuesta} onChange={(e) => set('tiempoRespuesta', e.target.value)} placeholder="~20 min" />
                </Field>
                <Field label="Garantia (dias)">
                  <input type="number" min="0" className="input" value={form.garantiaDias} onChange={(e) => set('garantiaDias', e.target.value)} />
                </Field>
              </div>
              <div>
                <label className="label">Zonas de atencion {errors.zonas && <span className="text-rose-600">— {errors.zonas}</span>}</label>
                <div className="grid max-h-44 grid-cols-2 gap-1 overflow-y-auto rounded-lg border border-slate-200 p-3 sm:grid-cols-3">
                  {DISTRITOS_LIMA.map((d) => (
                    <label key={d} className="flex items-center gap-2 text-sm text-slate-700">
                      <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-green-700 focus:ring-green-600"
                        checked={zonas.includes(d)} onChange={() => toggleZona(d)} />
                      {d}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creando...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Ya tienes cuenta? <Link to="/login" className="font-semibold text-green-700 hover:underline">Inicia sesion</Link>
        </p>
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  )
}
