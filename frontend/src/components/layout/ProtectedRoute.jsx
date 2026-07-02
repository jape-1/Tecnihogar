import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

// Requiere autenticacion. Si se pasa `rol`, ademas exige ese rol.
export default function ProtectedRoute({ children, rol }) {
  const { isAuthenticated, rol: userRol } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />
  }

  if (rol && userRol !== rol) {
    return <Navigate to="/" replace />
  }

  return children
}
