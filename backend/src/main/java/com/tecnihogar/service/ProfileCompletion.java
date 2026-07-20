package com.tecnihogar.service;

import com.tecnihogar.model.TechnicianProfile;

/** Calcula el porcentaje de completitud del perfil del tecnico  */
public final class ProfileCompletion {

    private ProfileCompletion() {}

    public static int calcular(TechnicianProfile p) {
        int total = 8;
        int hechos = 0;
        if (p.getBio() != null && !p.getBio().isBlank()) hechos++;
        if (p.getTarifaDesde() != null) hechos++;
        if (p.getTiempoRespuesta() != null && !p.getTiempoRespuesta().isBlank()) hechos++;
        if (p.getGarantiaDias() != null) hechos++;
        if (p.getTelefono() != null && !p.getTelefono().isBlank()) hechos++;
        if (p.getFotoUrl() != null && !p.getFotoUrl().isBlank()) hechos++;
        if (p.getZonas() != null && !p.getZonas().isEmpty()) hechos++;
        if (p.getWorks() != null && !p.getWorks().isEmpty()) hechos++;
        return Math.round((hechos * 100f) / total);
    }
}
