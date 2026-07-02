package com.tecnihogar.service;

import com.tecnihogar.dto.review.ReviewCreateDTO;
import com.tecnihogar.dto.review.ReviewDTO;
import com.tecnihogar.exception.BadRequestException;
import com.tecnihogar.exception.ResourceNotFoundException;
import com.tecnihogar.exception.UnauthorizedException;
import com.tecnihogar.model.*;
import com.tecnihogar.repository.ReviewRepository;
import com.tecnihogar.repository.ServiceRequestRepository;
import com.tecnihogar.repository.TechnicianProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ServiceRequestRepository requestRepository;
    private final TechnicianProfileRepository technicianRepository;
    private final CurrentUserProvider currentUser;
    private final DtoMapper mapper;

    @Transactional
    public ReviewDTO create(ReviewCreateDTO dto) {
        User cliente = currentUser.getCurrentUser();
        ServiceRequest req = requestRepository.findById(dto.requestId())
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada: " + dto.requestId()));

        if (!req.getCliente().getId().equals(cliente.getId())) {
            throw new UnauthorizedException("Solo puedes resenar tus propias solicitudes");
        }
        if (req.getEstado() != EstadoSolicitud.FINALIZADA) {
            throw new BadRequestException("Solo puedes resenar servicios finalizados");
        }
        if (reviewRepository.existsByRequestId(req.getId())) {
            throw new BadRequestException("Esta solicitud ya tiene una resena");
        }

        TechnicianProfile tecnico = req.getTecnico();
        Review review = Review.builder()
                .request(req)
                .cliente(cliente)
                .tecnico(tecnico)
                .estrellas(dto.estrellas())
                .comentario(dto.comentario())
                .build();
        review = reviewRepository.save(review);

        recalcRating(tecnico);

        return mapper.toReviewDTO(review);
    }

    @Transactional(readOnly = true)
    public List<ReviewDTO> byTechnician(Long tecnicoId) {
        return reviewRepository.findByTecnicoIdOrderByCreatedAtDesc(tecnicoId).stream()
                .map(mapper::toReviewDTO).toList();
    }

    private void recalcRating(TechnicianProfile tecnico) {
        Double avg = reviewRepository.findAverageRatingByTecnicoId(tecnico.getId());
        long count = reviewRepository.countByTecnicoId(tecnico.getId());
        tecnico.setRatingPromedio(avg == null ? BigDecimal.ZERO
                : BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP));
        tecnico.setTotalResenas((int) count);
        technicianRepository.save(tecnico);
    }
}
