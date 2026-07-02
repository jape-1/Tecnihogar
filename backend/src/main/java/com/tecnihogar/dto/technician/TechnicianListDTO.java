package com.tecnihogar.dto.technician;

import java.math.BigDecimal;
import java.util.List;

public record TechnicianListDTO(
        Long id,
        String nombre,
        String especialidad,
        Integer experienciaAnios,
        BigDecimal tarifaDesde,
        String tiempoRespuesta,
        Boolean disponible,
        Boolean verificado,
        BigDecimal ratingPromedio,
        Integer totalResenas,
        String fotoUrl,
        List<String> zonas
) {}
