import api from './api'

export const messagesService = {
  list: (requestId) => api.get(`/requests/${requestId}/messages`).then((r) => r.data),
  send: (requestId, contenido) =>
    api.post(`/requests/${requestId}/messages`, { contenido }).then((r) => r.data),
}
