import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-green-800">404</h1>
      <p className="mt-2 text-slate-500">La pagina que buscas no existe.</p>
      <Link to="/" className="btn-primary mt-6">Volver al inicio</Link>
    </div>
  )
}
