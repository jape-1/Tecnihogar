package com.tecnihogar.dto;

import java.time.LocalDateTime;

public record NotificationDTO(
        Long id,
        String mensaje,
        Boolean leida,
        String tipo,
        LocalDateTime createdAt
) {}
