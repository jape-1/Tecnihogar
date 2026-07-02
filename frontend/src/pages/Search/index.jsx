import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { techniciansService } from '../../services/technicians.service'
import TechnicianCard from '../../components/ui/TechnicianCard'
import FilterPanel from '../../components/forms/FilterPanel'
import Avatar from '../../components/ui/Avatar'
import StarRating from '../../components/ui/StarRating'

export default function Search() {
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  const [compare, setCompare] = useState([])
  const [showCompare, setShowCompare] = useState(false)

  const q = searchParams.get('q') || ''

  useEffect(() => {
    const esp = searchParams.get('especialidad')
    setFilters((f) => ({ ...f, especialidad: esp || undefined }))
  }, [searchParams])

  const apiParams = useMemo(() => {
    const p = {}
    if (filters.especialidad) p.especialidad = filters.especialidad
    if (filters.distrito) p.distrito = filters.distrito
    if (filters.minRating) p.minRating = filters.minRating
    if (filters.verificado) p.verificado = true
    if (filters.disponible) p.disponible = true
    return p
  }, [filters])

  const { data = [], isLoading } = useQuery({
    queryKey: ['technicians', 'search', apiParams],
    queryFn: () => techniciansService.search(apiParams),
  })

  // Filtro de texto libre en cliente (nombre / especialidad)
  const results = useMemo(() => {
    if (!q) return data
    const needle = q.toLowerCase()
    return data.filter((t) =>
      t.nombre.toLowerCase().includes(needle) ||
      t.especialidad.toLowerCase().includes(needle),
    )
  }, [data, q])

  const toggleCompare = (t) => {
    setCompare((prev) => {
      if (prev.find((x) => x.id === t.id)) return prev.filter((x) => x.id !== t.id)
      if (prev.length >= 2) return [prev[1], t]
      return [...prev, t]
    })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Resultados de busqueda</h1>
          <p className="text-sm text-slate-500">
            {isLoading ? 'Buscando...' : `${results.length} tecnico(s) encontrados`}
            {q && <> para "<span className="font-medium">{q}</span>"</>}
          </p>
        </div>
        <button className="btn-secondary lg:hidden" onClick={() => setShowFilters((v) => !v)}>Filtros</button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
          <FilterPanel filters={filters} onChange={setFilters} onReset={() => setFilters({})} />
        </aside>

        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => <div key={i} className="card h-52 animate-pulse bg-slate-100" />)}
            </div>
          ) : results.length === 0 ? (
            <div className="card p-10 text-center text-slate-500">No se encontraron tecnicos con esos filtros.</div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {results.map((t) => (
                <TechnicianCard key={t.id} tecnico={t}
                  onCompare={toggleCompare}
                  comparing={!!compare.find((x) => x.id === t.id)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Barra flotante de comparacion */}
      {compare.length > 0 && (
        <div className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full bg-green-800 px-5 py-3 text-white shadow-lg">
          <span className="text-sm">{compare.length} seleccionado(s)</span>
          <button disabled={compare.length < 2} onClick={() => setShowCompare(true)}
            className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-green-800 disabled:opacity-50">
            Comparar
          </button>
          <button onClick={() => setCompare([])} className="text-sm text-green-100">Limpiar</button>
        </div>
      )}

      {/* Modal de comparacion */}
      {showCompare && compare.length === 2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowCompare(false)}>
          <div className="w-full max-w-2xl card p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Comparar tecnicos</h3>
              <button onClick={() => setShowCompare(false)} className="text-slate-400">✕</button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {compare.map((t) => (
                <div key={t.id} className="rounded-lg border border-slate-200 p-4 text-center">
                  <div className="flex justify-center"><Avatar nombre={t.nombre} fotoUrl={t.fotoUrl} size="md" /></div>
                  <p className="mt-2 font-semibold">{t.nombre}</p>
                  <p className="text-sm text-slate-500">{t.especialidad}</p>
                  <div className="mt-2 flex justify-center"><StarRating value={t.ratingPromedio} count={t.totalResenas} /></div>
                  <p className="mt-2 text-sm">Desde <b>S/ {t.tarifaDesde}</b></p>
                  <p className="text-sm text-slate-500">{t.experienciaAnios} anios exp.</p>
                  <p className="text-sm text-slate-500">{t.tiempoRespuesta}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
