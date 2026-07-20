package com.tecnihogar.dto.stats;

import java.math.BigDecimal;
import java.util.List;

public record StatsDTO(
        long total,
        long activas,
        long completadas,
        long canceladas,
        BigDecimal ratingPromedio,   // solo TECNICO (null para CLIENTE)
        Integer totalResenas,        // solo TECNICO (null para CLIENTE)
        BigDecimal montoEstimado,    // ingresos (TECNICO) / gasto (CLIENTE) estimado por tarifa base
        List<MonthCountDTO> porMes   // servicios finalizados en los ultimos 6 meses
) {}
