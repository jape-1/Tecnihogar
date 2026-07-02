import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../../services/auth.service'
import { useAuth } from '../../hooks/useAuth'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'CLIENTE' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const auth = await authService.register(form)
      login(auth)
      navigate(auth.rol === 'TECNICO' ? '/tecnico/panel' : '/cliente/panel', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo completar el registro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-slate-800">Crear cuenta</h1>
        <p className="mt-1 text-sm text-slate-500">Unete a TecniHogar</p>

        {error && <div className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="label">Nombre completo</label>
            <input required className="input" value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Juan Perez" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" required className="input" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="tu@email.com" />
          </div>
          <div>
            <label className="label">Contrasena</label>
            <input type="password" required minLength={6} className="input" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Minimo 6 caracteres" />
          </div>
          <div>
            <label className="label">Quiero registrarme como</label>
            <div className="grid grid-cols-2 gap-2">
              {['CLIENTE', 'TECNICO'].map((r) => (
                <button key={r} type="button" onClick={() => setForm({ ...form, rol: r })}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                    form.rol === r ? 'border-green-700 bg-green-50 text-green-800' : 'border-slate-300 text-slate-600'
                  }`}>
                  {r === 'CLIENTE' ? 'Cliente' : 'Tecnico'}
                </button>
              ))}
            </div>
          </div>
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
