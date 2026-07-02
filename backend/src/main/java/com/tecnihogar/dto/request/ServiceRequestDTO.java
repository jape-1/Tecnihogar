package com.tecnihogar.dto.request;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record ServiceRequestDTO(
        Long id,
        String codigoReferencia,
        Long clienteId,
        String clienteNombre,
        Long tecnicoId,
        String tecnicoNombre,
        String tecnicoFotoUrl,
        String tecnicoTelefono,
        String tipoServicio,
        String descripcion,
        String direccion,
        String distrito,
        LocalDate fechaPreferida,
        LocalTime horaPreferida,
        String estado,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Boolean tieneResena
) {}
