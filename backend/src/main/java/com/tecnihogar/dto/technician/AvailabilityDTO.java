package com.tecnihogar.dto.technician;

import jakarta.validation.constraints.NotNull;

public record AvailabilityDTO(
        @NotNull(message = "El campo disponible es obligatorio")
        Boolean disponible
) {}
