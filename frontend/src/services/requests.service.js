import api from './api'

export const requestsService = {
  create: (data) => api.post('/requests', data).then((r) => r.data),
  my: () => api.get('/requests/my').then((r) => r.data),
  incoming: () => api.get('/requests/incoming').then((r) => r.data),
  stats: () => api.get('/requests/stats').then((r) => r.data),
  getById: (id) => api.get(`/requests/${id}`).then((r) => r.data),
  updateStatus: (id, estado) =>
    api.patch(`/requests/${id}/status`, { estado }).then((r) => r.data),
}
