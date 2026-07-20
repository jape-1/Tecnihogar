package com.tecnihogar.dto.auth;

import com.tecnihogar.model.Especialidad;

import java.math.BigDecimal;
import java.util.List;

/** Datos opcionales del perfil de tecnico enviados en el registro (null si rol = CLIENTE). */
public record TechnicianRegisterData(
        Especialidad especialidad,
        Integer experienciaAnios,
        String bio,
        BigDecimal tarifaDesde,
        String tiempoRespuesta,
        Integer garantiaDias,
        String telefono,
        List<String> zonas
) {}
