import api from './api'

export const notificationsService = {
  my: () => api.get('/notifications/my').then((r) => r.data),
  markAllRead: () => api.patch('/notifications/read-all').then((r) => r.data),
}
