package com.tecnihogar.service;

import com.tecnihogar.dto.NotificationDTO;
import com.tecnihogar.model.Notification;
import com.tecnihogar.model.User;
import com.tecnihogar.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final CurrentUserProvider currentUser;
    private final DtoMapper mapper;

    public void notify(User user, String mensaje, String tipo) {
        Notification n = Notification.builder()
                .user(user).mensaje(mensaje).tipo(tipo).leida(false).build();
        notificationRepository.save(n);
    }

    @Transactional(readOnly = true)
    public List<NotificationDTO> myNotifications() {
        User user = currentUser.getCurrentUser();
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(mapper::toNotificationDTO).toList();
    }

    @Transactional
    public int markAllRead() {
        User user = currentUser.getCurrentUser();
        List<Notification> unread = notificationRepository.findByUserIdAndLeidaFalse(user.getId());
        unread.forEach(n -> n.setLeida(true));
        notificationRepository.saveAll(unread);
        return unread.size();
    }
}
