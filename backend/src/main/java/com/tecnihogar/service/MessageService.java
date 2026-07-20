package com.tecnihogar.service;

import com.tecnihogar.dto.message.MessageCreateDTO;
import com.tecnihogar.dto.message.MessageDTO;
import com.tecnihogar.exception.ResourceNotFoundException;
import com.tecnihogar.exception.UnauthorizedException;
import com.tecnihogar.model.Message;
import com.tecnihogar.model.ServiceRequest;
import com.tecnihogar.model.User;
import com.tecnihogar.repository.MessageRepository;
import com.tecnihogar.repository.ServiceRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ServiceRequestRepository requestRepository;
    private final NotificationService notificationService;
    private final CurrentUserProvider currentUser;

    @Transactional
    public List<MessageDTO> getMessages(Long requestId) {
        User user = currentUser.getCurrentUser();
        findAndAuthorize(requestId, user);

        // Al abrir la conversacion, marca como leidos los mensajes de la otra parte
        List<Message> unread = messageRepository.findByRequestIdAndSenderIdNotAndLeidoFalse(requestId, user.getId());
        if (!unread.isEmpty()) {
            unread.forEach(m -> m.setLeido(true));
            messageRepository.saveAll(unread);
        }

        return messageRepository.findByRequestIdOrderByCreatedAtAsc(requestId).stream()
                .map(m -> toDTO(m, user))
                .toList();
    }

    @Transactional
    public MessageDTO send(Long requestId, MessageCreateDTO dto) {
        User user = currentUser.getCurrentUser();
        ServiceRequest req = findAndAuthorize(requestId, user);

        Message m = Message.builder()
                .request(req)
                .sender(user)
                .contenido(dto.contenido().trim())
                .leido(false)
                .build();
        m = messageRepository.save(m);

        // Notificar a la contraparte
        User destinatario = user.getId().equals(req.getCliente().getId())
                ? req.getTecnico().getUser()
                : req.getCliente();
        notificationService.notify(destinatario,
                "Nuevo mensaje de " + user.getNombre() + " en la solicitud " + req.getCodigoReferencia(),
                "MENSAJE_NUEVO");

        return toDTO(m, user);
    }

    private ServiceRequest findAndAuthorize(Long requestId, User user) {
        ServiceRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada: " + requestId));
        boolean esCliente = req.getCliente().getId().equals(user.getId());
        boolean esTecnico = req.getTecnico().getUser().getId().equals(user.getId());
        if (!esCliente && !esTecnico) {
            throw new UnauthorizedException("No tienes acceso a esta conversacion");
        }
        return req;
    }

    private MessageDTO toDTO(Message m, User viewer) {
        return new MessageDTO(
                m.getId(),
                m.getRequest().getId(),
                m.getSender().getId(),
                m.getSender().getNombre(),
                m.getContenido(),
                m.getSender().getId().equals(viewer.getId()),
                m.getCreatedAt()
        );
    }
}
