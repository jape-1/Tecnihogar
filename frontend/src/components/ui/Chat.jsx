import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { messagesService } from '../../services/messages.service'
import { formatRelative } from '../../utils/formatDate'

export default function Chat({ requestId }) {
  const queryClient = useQueryClient()
  const [texto, setTexto] = useState('')
  const scrollRef = useRef(null)

  const { data: mensajes = [], isLoading } = useQuery({
    queryKey: ['messages', requestId],
    queryFn: () => messagesService.list(requestId),
    refetchInterval: 5_000, // chat en vivo por polling
  })

  const send = useMutation({
    mutationFn: (contenido) => messagesService.send(requestId, contenido),
    onSuccess: () => {
      setTexto('')
      queryClient.invalidateQueries({ queryKey: ['messages', requestId] })
    },
  })

  // Auto-scroll al ultimo mensaje
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [mensajes.length])

  const submit = (e) => {
    e.preventDefault()
    const t = texto.trim()
    if (t && !send.isPending) send.mutate(t)
  }

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-slate-800">Chat</h3>
      <p className="text-xs text-slate-400">Coordina los detalles del servicio.</p>

      <div ref={scrollRef} className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
        {isLoading ? (
          <p className="py-6 text-center text-sm text-slate-400">Cargando mensajes...</p>
        ) : mensajes.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">Aun no hay mensajes. Escribe el primero.</p>
        ) : (
          mensajes.map((m) => (
            <div key={m.id} className={`flex ${m.mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                m.mine ? 'bg-green-700 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {!m.mine && <p className="text-xs font-semibold text-slate-500">{m.senderNombre}</p>}
                <p className="whitespace-pre-wrap break-words">{m.contenido}</p>
                <p className={`mt-0.5 text-[10px] ${m.mine ? 'text-green-100' : 'text-slate-400'}`}>
                  {formatRelative(m.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={submit} className="mt-4 flex gap-2">
        <input
          className="input flex-1"
          placeholder="Escribe un mensaje..."
          maxLength={1000}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <button type="submit" className="btn-primary whitespace-nowrap" disabled={!texto.trim() || send.isPending}>
          {send.isPending ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
      {send.isError && <p className="mt-2 text-sm text-rose-600">No se pudo enviar el mensaje.</p>}
    </div>
  )
}
