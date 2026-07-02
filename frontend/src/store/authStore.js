import { create } from 'zustand'

const STORAGE_KEY = 'tecnihogar_auth'

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { user: null, token: null, rol: null, isAuthenticated: false }
    const parsed = JSON.parse(raw)
    return {
      user: parsed.user ?? null,
      token: parsed.token ?? null,
      rol: parsed.rol ?? null,
      isAuthenticated: !!parsed.token,
    }
  } catch {
    return { user: null, token: null, rol: null, isAuthenticated: false }
  }
}

export const useAuthStore = create((set) => ({
  ...loadInitial(),

  // authResponse: { token, rol, nombre, id }
  login: (authResponse) => {
    const user = { id: authResponse.id, nombre: authResponse.nombre }
    const state = { user, token: authResponse.token, rol: authResponse.rol }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    set({ ...state, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY)
    set({ user: null, token: null, rol: null, isAuthenticated: false })
  },
}))
