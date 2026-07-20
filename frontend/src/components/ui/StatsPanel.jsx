export default function StatsPanel({ stats, esTecnico }) {
  if (!stats) {
    return <p className="mt-6 text-sm text-slate-400">Cargando estadisticas...</p>
  }

  const porMes = stats.porMes || []
  const maxMes = Math.max(1, ...porMes.map((m) => m.cantidad))
  const monto = Number(stats.montoEstimado || 0)

  return (
    <div className="mt-6 space-y-6">
      {/* Tarjetas principales */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Metric label="Total solicitudes" value={stats.total} />
        <Metric label="Completadas" value={stats.completadas} />
        <Metric label="Activas" value={stats.activas} />
        <Metric label={esTecnico ? 'Ingresos estimados' : 'Gasto estimado'} value={`S/ ${monto.toFixed(0)}`} />
      </div>

      {/* Fila especifica de tecnico */}
      {esTecnico && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Metric label="Calificacion promedio" value={Number(stats.ratingPromedio ?? 0).toFixed(1)} />
          <Metric label="Total resenas" value={stats.totalResenas ?? 0} />
          <Metric label="Canceladas" value={stats.canceladas} />
        </div>
      )}

      {/* Grafico de barras */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-800">Servicios finalizados (ult. 6 meses)</h2>
        <div className="mt-6 flex items-end justify-between gap-3" style={{ height: 160 }}>
          {porMes.map((m) => (
            <div key={m.mes} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs font-medium text-slate-600">{m.cantidad}</span>
              <div
                className="w-full max-w-[40px] rounded-t bg-green-700 transition-all"
                style={{ height: `${(m.cantidad / maxMes) * 120}px`, minHeight: m.cantidad > 0 ? 8 : 2 }}
              />
              <span className="text-xs text-slate-500">{m.mes}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400">
        * El monto es una estimacion basada en la tarifa base de cada tecnico por servicio finalizado.
      </p>
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div className="card p-5">
      <p className="text-3xl font-bold text-green-800">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  )
}
