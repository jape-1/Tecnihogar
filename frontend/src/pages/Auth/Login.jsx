import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { authService } from '../../services/auth.service'
import { useAuth } from '../../hooks/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Mensaje informativo (ej: tras registrarse) y destino de retorno
  const message = location.state?.message
  const returnTo = location.state?.returnTo || location.state?.from

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const auth = await authService.login(form)
      login(auth)
      const dest = returnTo
        ? returnTo
        : auth.rol === 'TECNICO' ? '/tecnico/panel' : '/cliente/panel'
      navigate(dest, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo iniciar sesion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-slate-800">Iniciar sesion</h1>
        <p className="mt-1 text-sm text-slate-500">Ingresa a tu cuenta de TecniHogar</p>

        {message && <div className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">{message}</div>}
        {error && <div className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="label">Email</label>
            <input type="email" required className="input" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="tu@email.com" />
          </div>
          <div>
            <label className="label">Contrasena</label>
            <input type="password" required className="input" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="********" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Ingresando...' : 'Iniciar sesion'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          No tienes cuenta? <Link to="/register" className="font-semibold text-green-700 hover:underline">Registrate</Link>
        </p>
      </div>
    </div>
  )
}
