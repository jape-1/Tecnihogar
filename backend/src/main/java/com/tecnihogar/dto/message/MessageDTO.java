package com.tecnihogar.dto.message;

import java.time.LocalDateTime;

public record MessageDTO(
        Long id,
        Long requestId,
        Long senderId,
        String senderNombre,
        String contenido,
        boolean mine,
        LocalDateTime createdAt
) {}
