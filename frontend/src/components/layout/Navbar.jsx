import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../ui/Avatar'

export default function Navbar() {
  const { isAuthenticated, isCliente, isTecnico, user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdown, setDropdown] = useState(false)

  const handleLogout = () => {
    logout()
    setDropdown(false)
    setMenuOpen(false)
    navigate('/')
  }

  const panelPath = isTecnico ? '/tecnico/panel' : '/cliente/panel'

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-800 text-green-50">🏠</span>
          <span className="text-lg font-bold text-green-800">TecniHogar</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/buscar" className="text-sm font-medium text-slate-600 hover:text-green-800">Buscar tecnicos</Link>

          {!isAuthenticated && (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-green-800">Iniciar sesion</Link>
              <Link to="/register" className="btn-primary">Registrarse</Link>
            </>
          )}

          {isAuthenticated && (
            <>
              {isCliente && (
                <Link to="/cliente/panel" className="text-sm font-medium text-slate-600 hover:text-green-800">Mis solicitudes</Link>
              )}
              {isTecnico && (
                <>
                  <Link to="/tecnico/panel" className="text-sm font-medium text-slate-600 hover:text-green-800">Solicitudes</Link>
                  <Link to="/tecnico/panel" className="text-sm font-medium text-slate-600 hover:text-green-800">Mi perfil</Link>
                </>
              )}
              <div className="relative">
                <button onClick={() => setDropdown((v) => !v)} className="flex items-center gap-2">
                  <Avatar nombre={user?.nombre} size="sm" />
                </button>
                {dropdown && (
                  <div className="absolute right-0 mt-2 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                    <Link to={panelPath} onClick={() => setDropdown(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Mi panel</Link>
                    <button onClick={handleLogout} className="block w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-slate-50">Cerrar sesion</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
          <span className="text-2xl">☰</span>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
          <Link to="/buscar" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-slate-700">Buscar tecnicos</Link>
          {!isAuthenticated && (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-slate-700">Iniciar sesion</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-semibold text-green-800">Registrarse</Link>
            </>
          )}
          {isAuthenticated && (
            <>
              <Link to={panelPath} onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-slate-700">Mi panel</Link>
              <button onClick={handleLogout} className="block py-2 text-sm text-rose-600">Cerrar sesion</button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
