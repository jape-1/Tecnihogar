import api from './api'

export const reportsService = {
  create: (data) => api.post('/reports', data).then((r) => r.data),
}
