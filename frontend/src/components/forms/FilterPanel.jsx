import { ESPECIALIDADES, DISTRITOS_LIMA } from '../../utils/constants'

export default function FilterPanel({ filters, onChange, onReset }) {
  const set = (key, value) => onChange({ ...filters, [key]: value })

  return (
    <div className="card space-y-5 p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">Filtros</h3>
        <button type="button" onClick={onReset} className="text-xs text-green-700 hover:underline">
          Limpiar
        </button>
      </div>

      <div>
        <label className="label">Especialidad</label>
        <select className="input" value={filters.especialidad || ''} onChange={(e) => set('especialidad', e.target.value)}>
          <option value="">Todas</option>
          {ESPECIALIDADES.map((e) => (
            <option key={e.value} value={e.value}>{e.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">Distrito</label>
        <select className="input" value={filters.distrito || ''} onChange={(e) => set('distrito', e.target.value)}>
          <option value="">Todos</option>
          {DISTRITOS_LIMA.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">Calificacion minima</label>
        <select className="input" value={filters.minRating || ''} onChange={(e) => set('minRating', e.target.value)}>
          <option value="">Cualquiera</option>
          <option value="4.5">4.5 o mas</option>
          <option value="4">4.0 o mas</option>
          <option value="3">3.0 o mas</option>
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-green-700 focus:ring-green-600"
          checked={filters.verificado === true}
          onChange={(e) => set('verificado', e.target.checked ? true : undefined)}
        />
        Solo verificados
      </label>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-green-700 focus:ring-green-600"
          checked={filters.disponible === true}
          onChange={(e) => set('disponible', e.target.checked ? true : undefined)}
        />
        Solo disponibles
      </label>
    </div>
  )
}
