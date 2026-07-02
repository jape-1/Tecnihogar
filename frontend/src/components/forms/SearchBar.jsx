import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ESPECIALIDADES } from '../../utils/constants'

export default function SearchBar() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [especialidad, setEspecialidad] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (especialidad) params.set('especialidad', especialidad)
    navigate(`/buscar?${params.toString()}`)
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 rounded-xl bg-white p-2 shadow-lg sm:flex-row">
      <input
        className="input flex-1 border-0 focus:ring-0"
        placeholder="Que necesitas? Ej. reparar una fuga"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <select
        className="input border-0 focus:ring-0 sm:w-48"
        value={especialidad}
        onChange={(e) => setEspecialidad(e.target.value)}
      >
        <option value="">Todas las categorias</option>
        {ESPECIALIDADES.map((e) => (
          <option key={e.value} value={e.value}>{e.label}</option>
        ))}
      </select>
      <button type="submit" className="btn-primary sm:w-32">Buscar</button>
    </form>
  )
}
