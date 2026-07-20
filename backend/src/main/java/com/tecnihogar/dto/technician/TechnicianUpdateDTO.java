package com.tecnihogar.dto.technician;

import com.tecnihogar.model.Especialidad;

import java.math.BigDecimal;
import java.util.List;

public record TechnicianUpdateDTO(
        String nombre,
        Especialidad especialidad,
        Integer experienciaAnios,
        String bio,
        BigDecimal tarifaDesde,
        String tiempoRespuesta,
        Integer garantiaDias,
        String telefono,
        List<String> zonas
) {}
