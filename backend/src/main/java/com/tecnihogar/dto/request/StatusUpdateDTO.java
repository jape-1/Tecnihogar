package com.tecnihogar.dto.request;

import com.tecnihogar.model.EstadoSolicitud;
import jakarta.validation.constraints.NotNull;

public record StatusUpdateDTO(
        @NotNull(message = "El estado es obligatorio")
        EstadoSolicitud estado
) {}
