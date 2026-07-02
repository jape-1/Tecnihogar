package com.tecnihogar.dto.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ReviewCreateDTO(
        @NotNull(message = "La solicitud es obligatoria")
        Long requestId,

        @NotNull(message = "Las estrellas son obligatorias")
        @Min(value = 1, message = "Minimo 1 estrella")
        @Max(value = 5, message = "Maximo 5 estrellas")
        Integer estrellas,

        String comentario
) {}
