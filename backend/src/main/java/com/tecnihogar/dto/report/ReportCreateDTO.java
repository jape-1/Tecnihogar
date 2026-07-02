package com.tecnihogar.dto.report;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ReportCreateDTO(
        @NotNull(message = "La solicitud es obligatoria")
        Long requestId,

        @NotBlank(message = "El tipo de incidente es obligatorio")
        String tipoIncidente,

        @NotBlank(message = "La descripcion es obligatoria")
        String descripcion
) {}
