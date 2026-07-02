import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const { user, token, rol, isAuthenticated, login, logout } = useAuthStore()
  return {
    user,
    token,
    rol,
    isAuthenticated,
    isCliente: rol === 'CLIENTE',
    isTecnico: rol === 'TECNICO',
    login,
    logout,
  }
}
