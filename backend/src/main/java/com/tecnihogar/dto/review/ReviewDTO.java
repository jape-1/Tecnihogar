package com.tecnihogar.dto.review;

import java.time.LocalDateTime;

public record ReviewDTO(
        Long id,
        Long tecnicoId,
        String clienteNombre,
        Integer estrellas,
        String comentario,
        LocalDateTime createdAt
) {}
