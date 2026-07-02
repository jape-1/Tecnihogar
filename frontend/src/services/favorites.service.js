import api from './api'

export const favoritesService = {
  add: (technicianId) => api.post(`/favorites/${technicianId}`).then((r) => r.data),
  remove: (technicianId) => api.delete(`/favorites/${technicianId}`).then((r) => r.data),
  my: () => api.get('/favorites/my').then((r) => r.data),
}
