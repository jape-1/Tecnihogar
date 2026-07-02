package com.tecnihogar.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public record ServiceRequestCreateDTO(
        @NotNull(message = "El tecnico es obligatorio")
        Long tecnicoId,

        @NotBlank(message = "El tipo de servicio es obligatorio")
        String tipoServicio,

        @NotBlank(message = "La descripcion es obligatoria")
        String descripcion,

        @NotBlank(message = "La direccion es obligatoria")
        String direccion,

        @NotBlank(message = "El distrito es obligatorio")
        String distrito,

        @NotNull(message = "La fecha preferida es obligatoria")
        LocalDate fechaPreferida,

        @NotNull(message = "La hora preferida es obligatoria")
        LocalTime horaPreferida
) {}
