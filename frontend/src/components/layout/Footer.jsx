import { Link } from 'react-router-dom'
import logo from '../../assets/logotecnihogar.jpeg'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <img src={logo} alt="TecniHogar" className="h-16 w-auto" />
          <p className="mt-2 text-sm text-slate-500">
            Conectamos hogares con tecnicos verificados en gasfiteria, electricidad y mantenimiento en Lima.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Servicios</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li><Link to="/buscar?especialidad=GASFITERIA" className="hover:text-green-700">Gasfiteria</Link></li>
            <li><Link to="/buscar?especialidad=ELECTRICIDAD" className="hover:text-green-700">Electricidad</Link></li>
            <li><Link to="/buscar?especialidad=MANTENIMIENTO" className="hover:text-green-700">Mantenimiento</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Empresa</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li><a href="#" className="hover:text-green-700">Sobre nosotros</a></li>
            <li><a href="#" className="hover:text-green-700">Como funciona</a></li>
            <li><a href="#" className="hover:text-green-700">Trabaja con nosotros</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Soporte</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li><a href="#" className="hover:text-green-700">Centro de ayuda</a></li>
            <li><a href="#" className="hover:text-green-700">Contacto</a></li>
            <li><a href="#" className="hover:text-green-700">Terminos y privacidad</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © 2025 TecniHogar. Lima, Peru.
      </div>
    </footer>
  )
}
