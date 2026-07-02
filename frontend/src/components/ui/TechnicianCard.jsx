import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import StarRating from './StarRating'

const ESP_LABEL = {
  GASFITERIA: 'Gasfiteria',
  ELECTRICIDAD: 'Electricidad',
  MANTENIMIENTO: 'Mantenimiento',
  OTROS: 'Otros',
}

export default function TechnicianCard({ tecnico, onCompare, comparing }) {
  return (
    <div className="card flex flex-col p-4">
      <div className="flex items-start gap-3">
        <Avatar nombre={tecnico.nombre} fotoUrl={tecnico.fotoUrl} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-slate-800">{tecnico.nombre}</h3>
            {tecnico.verificado && (
              <span className="chip bg-blue-50 text-blue-600" title="Tecnico verificado">✓ Verificado</span>
            )}
          </div>
          <p className="text-sm text-slate-500">{ESP_LABEL[tecnico.especialidad] || tecnico.especialidad}</p>
          <div className="mt-1">
            <StarRating value={tecnico.ratingPromedio} count={tecnico.totalResenas} />
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {(tecnico.zonas || []).slice(0, 3).map((z) => (
          <span key={z} className="chip">{z}</span>
        ))}
        {(tecnico.zonas || []).length > 3 && (
          <span className="chip bg-slate-100 text-slate-500">+{tecnico.zonas.length - 3}</span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-slate-500">Desde <span className="font-semibold text-slate-800">S/ {tecnico.tarifaDesde}</span></span>
        <span className={`text-xs font-medium ${tecnico.disponible ? 'text-green-700' : 'text-slate-400'}`}>
          {tecnico.disponible ? '● Disponible' : '○ No disponible'}
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        <Link to={`/tecnico/${tecnico.id}`} className="btn-primary flex-1">Ver perfil</Link>
        {onCompare && (
          <button
            type="button"
            onClick={() => onCompare(tecnico)}
            className={comparing ? 'btn bg-green-100 text-green-800' : 'btn-secondary'}
          >
            {comparing ? 'Quitar' : 'Comparar'}
          </button>
        )}
      </div>
    </div>
  )
}
