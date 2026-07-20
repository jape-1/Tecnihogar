package com.tecnihogar.repository;

import com.tecnihogar.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByRequestIdOrderByCreatedAtAsc(Long requestId);

    // Mensajes de la solicitud que NO envio el usuario dado y siguen sin leer
    List<Message> findByRequestIdAndSenderIdNotAndLeidoFalse(Long requestId, Long senderId);
}
