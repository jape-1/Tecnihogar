package com.tecnihogar.service;

import com.tecnihogar.dto.FavoriteDTO;
import com.tecnihogar.dto.NotificationDTO;
import com.tecnihogar.dto.request.ServiceRequestDTO;
import com.tecnihogar.dto.review.ReviewDTO;
import com.tecnihogar.dto.technician.TechnicianListDTO;
import com.tecnihogar.dto.technician.WorkDTO;
import com.tecnihogar.model.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DtoMapper {

    public TechnicianListDTO toListDTO(TechnicianProfile p) {
        return new TechnicianListDTO(
                p.getId(),
                p.getUser().getNombre(),
                p.getEspecialidad().name(),
                p.getExperienciaAnios(),
                p.getTarifaDesde(),
                p.getTiempoRespuesta(),
                p.getDisponible(),
                p.getVerificado(),
                p.getRatingPromedio(),
                p.getTotalResenas(),
                p.getFotoUrl(),
                p.getZonas().stream().map(TechnicianZone::getDistrito).toList()
        );
    }

    public WorkDTO toWorkDTO(TechnicianWork w) {
        return new WorkDTO(w.getId(), w.getImagenUrl(), w.getDescripcion());
    }

    public ReviewDTO toReviewDTO(Review r) {
        return new ReviewDTO(
                r.getId(),
                r.getTecnico().getId(),
                r.getCliente().getNombre(),
                r.getEstrellas(),
                r.getComentario(),
                r.getCreatedAt()
        );
    }

    public NotificationDTO toNotificationDTO(Notification n) {
        return new NotificationDTO(n.getId(), n.getMensaje(), n.getLeida(), n.getTipo(), n.getCreatedAt());
    }

    public FavoriteDTO toFavoriteDTO(Favorite f) {
        return new FavoriteDTO(f.getId(), toListDTO(f.getTecnico()));
    }

    public ServiceRequestDTO toRequestDTO(ServiceRequest s, String telefonoParcial, boolean tieneResena) {
        return new ServiceRequestDTO(
                s.getId(),
                s.getCodigoReferencia(),
                s.getCliente().getId(),
                s.getCliente().getNombre(),
                s.getTecnico().getId(),
                s.getTecnico().getUser().getNombre(),
                s.getTecnico().getFotoUrl(),
                telefonoParcial,
                s.getTipoServicio(),
                s.getDescripcion(),
                s.getDireccion(),
                s.getDistrito(),
                s.getFechaPreferida(),
                s.getHoraPreferida(),
                s.getEstado().name(),
                s.getCreatedAt(),
                s.getUpdatedAt(),
                tieneResena
        );
    }

    public List<String> zonas(TechnicianProfile p) {
        return p.getZonas().stream().map(TechnicianZone::getDistrito).toList();
    }
}
