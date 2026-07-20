import api from './api'

export const techniciansService = {
  search: (params) => api.get('/technicians', { params }).then((r) => r.data),
  featured: () => api.get('/technicians/featured').then((r) => r.data),
  getById: (id) => api.get(`/technicians/${id}`).then((r) => r.data),
  getMe: () => api.get('/technicians/me').then((r) => r.data),
  updateMe: (data) => api.put('/technicians/me', data).then((r) => r.data),
  setAvailability: (disponible) =>
    api.patch('/technicians/me/availability', { disponible }).then((r) => r.data),
  updateZones: (zonas) =>
    api.put('/technicians/me/zones', { zonas }).then((r) => r.data),
  uploadPhoto: (file) => {
    const form = new FormData()
    form.append('file', file)
    return api.post('/technicians/me/photo', form).then((r) => r.data)
  },
  addWork: (file, descripcion) => {
    const form = new FormData()
    form.append('file', file)
    if (descripcion) form.append('descripcion', descripcion)
    return api.post('/technicians/me/works', form).then((r) => r.data)
  },
  deleteWork: (id) => api.delete(`/technicians/me/works/${id}`).then((r) => r.data),
}
