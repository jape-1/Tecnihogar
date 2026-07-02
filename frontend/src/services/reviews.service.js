import api from './api'

export const reviewsService = {
  create: (data) => api.post('/reviews', data).then((r) => r.data),
  byTechnician: (id) => api.get(`/reviews/technician/${id}`).then((r) => r.data),
}
