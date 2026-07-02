package com.tecnihogar.dto.technician;

import com.tecnihogar.dto.review.ReviewDTO;

import java.math.BigDecimal;
import java.util.List;

public record TechnicianDetailDTO(
        Long id,
        Long userId,
        String nombre,
        String especialidad,
        Integer experienciaAnios,
        String bio,
        BigDecimal tarifaDesde,
        String tiempoRespuesta,
        Integer garantiaDias,
        Boolean disponible,
        Boolean verificado,
        BigDecimal ratingPromedio,
        Integer totalResenas,
        String fotoUrl,
        Integer perfilCompletitud,
        List<String> zonas,
        List<WorkDTO> works,
        List<ReviewDTO> resenas
) {}
