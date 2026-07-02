import { Link } from 'react-router-dom'
import SearchBar from '../../components/forms/SearchBar'
import TechnicianCard from '../../components/ui/TechnicianCard'
import { useFeaturedTechnicians } from '../../hooks/useTechnicians'
import { CATEGORIAS } from '../../utils/constants'

const ICONS = { drop: '💧', bolt: '⚡', wrench: '🔧', grid: '🧰' }

export default function Home() {
  const { data: featured = [], isLoading } = useFeaturedTechnicians()

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-green-800 to-green-900 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">Tecnicos del hogar verificados en Lima</h1>
          <p className="mt-3 text-green-50">
            Gasfiteria, electricidad y mantenimiento con profesionales calificados y garantia.
          </p>
          <div className="mx-auto mt-8 max-w-3xl">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xl font-bold text-slate-800">Categorias</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {CATEGORIAS.map((c) => (
            <Link key={c.value} to={`/buscar?especialidad=${c.value}`}
              className="card flex flex-col items-center p-6 text-center transition hover:shadow-md">
              <span className="text-4xl">{ICONS[c.icon]}</span>
              <span className="mt-3 font-semibold text-slate-800">{c.label}</span>
              <span className="mt-1 text-xs text-slate-500">{c.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Destacados */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Tecnicos destacados</h2>
          <Link to="/buscar" className="text-sm font-semibold text-green-700 hover:underline">Ver todos</Link>
        </div>

        {isLoading ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card h-52 animate-pulse bg-slate-100" />
            ))}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((t) => (
              <TechnicianCard key={t.id} tecnico={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
