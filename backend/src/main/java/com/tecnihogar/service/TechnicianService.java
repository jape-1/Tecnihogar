package com.tecnihogar.service;

import com.tecnihogar.dto.review.ReviewDTO;
import com.tecnihogar.dto.technician.TechnicianDetailDTO;
import com.tecnihogar.dto.technician.TechnicianListDTO;
import com.tecnihogar.dto.technician.TechnicianUpdateDTO;
import com.tecnihogar.dto.technician.WorkDTO;
import com.tecnihogar.exception.BadRequestException;
import com.tecnihogar.exception.ResourceNotFoundException;
import com.tecnihogar.exception.UnauthorizedException;
import com.tecnihogar.model.*;
import com.tecnihogar.repository.ReviewRepository;
import com.tecnihogar.repository.TechnicianProfileRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TechnicianService {

    private final TechnicianProfileRepository technicianRepository;
    private final ReviewRepository reviewRepository;
    private final CloudinaryService cloudinaryService;
    private final CurrentUserProvider currentUser;
    private final DtoMapper mapper;

    @Transactional(readOnly = true)
    public List<TechnicianListDTO> search(String especialidad, String distrito,
                                          Double minRating, Boolean verificado, Boolean disponible) {
        Specification<TechnicianProfile> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (especialidad != null && !especialidad.isBlank()) {
                predicates.add(cb.equal(root.get("especialidad"),
                        Especialidad.valueOf(especialidad.toUpperCase())));
            }
            if (minRating != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("ratingPromedio"), BigDecimal.valueOf(minRating)));
            }
            if (verificado != null) {
                predicates.add(cb.equal(root.get("verificado"), verificado));
            }
            if (disponible != null) {
                predicates.add(cb.equal(root.get("disponible"), disponible));
            }
            if (distrito != null && !distrito.isBlank()) {
                var join = root.join("zonas");
                predicates.add(cb.equal(join.get("distrito"), distrito));
                if (query != null) query.distinct(true);
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return technicianRepository.findAll(spec).stream()
                .sorted((a, b) -> b.getRatingPromedio().compareTo(a.getRatingPromedio()))
                .map(mapper::toListDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TechnicianListDTO> featured() {
        return technicianRepository.findTop3ByVerificadoTrueOrderByRatingPromedioDesc().stream()
                .map(mapper::toListDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public TechnicianDetailDTO getById(Long id) {
        TechnicianProfile p = technicianRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tecnico no encontrado: " + id));
        return buildDetail(p, false);
    }

    @Transactional(readOnly = true)
    public TechnicianDetailDTO getMyProfile() {
        return buildDetail(requireOwnProfile(), true);
    }

    @Transactional
    public TechnicianDetailDTO updateMyProfile(TechnicianUpdateDTO dto) {
        TechnicianProfile p = requireOwnProfile();
        if (dto.nombre() != null && !dto.nombre().isBlank()) p.getUser().setNombre(dto.nombre());
        if (dto.especialidad() != null) p.setEspecialidad(dto.especialidad());
        if (dto.experienciaAnios() != null) p.setExperienciaAnios(dto.experienciaAnios());
        if (dto.bio() != null) p.setBio(dto.bio());
        if (dto.tarifaDesde() != null) p.setTarifaDesde(dto.tarifaDesde());
        if (dto.tiempoRespuesta() != null) p.setTiempoRespuesta(dto.tiempoRespuesta());
        if (dto.garantiaDias() != null) p.setGarantiaDias(dto.garantiaDias());
        if (dto.telefono() != null) p.setTelefono(dto.telefono());
        if (dto.zonas() != null) replaceZones(p, dto.zonas());
        p.setPerfilCompletitud(ProfileCompletion.calcular(p));
        technicianRepository.save(p);
        return buildDetail(p, true);
    }

    @Transactional
    public List<String> updateZones(List<String> zonas) {
        TechnicianProfile p = requireOwnProfile();
        replaceZones(p, zonas);
        p.setPerfilCompletitud(ProfileCompletion.calcular(p));
        technicianRepository.save(p);
        return p.getZonas().stream().map(TechnicianZone::getDistrito).toList();
    }

    @Transactional
    public boolean updateAvailability(boolean disponible) {
        TechnicianProfile p = requireOwnProfile();
        p.setDisponible(disponible);
        technicianRepository.save(p);
        return disponible;
    }

    @Transactional
    public String updatePhoto(MultipartFile file) throws IOException {
        TechnicianProfile p = requireOwnProfile();
        CloudinaryService.UploadResult up = cloudinaryService.uploadImage(file, "profiles");
        p.setFotoUrl(up.url());
        p.setPerfilCompletitud(ProfileCompletion.calcular(p));
        technicianRepository.save(p);
        return up.url();
    }

    @Transactional
    public WorkDTO addWork(MultipartFile file, String descripcion) throws IOException {
        TechnicianProfile p = requireOwnProfile();
        CloudinaryService.UploadResult up = cloudinaryService.uploadImage(file, "works");
        TechnicianWork work = TechnicianWork.builder()
                .tecnico(p).imagenUrl(up.url()).publicId(up.publicId()).descripcion(descripcion).build();
        p.getWorks().add(work);
        p.setPerfilCompletitud(ProfileCompletion.calcular(p));
        technicianRepository.save(p);
        return mapper.toWorkDTO(p.getWorks().get(p.getWorks().size() - 1));
    }

    @Transactional
    public void deleteWork(Long workId) {
        TechnicianProfile p = requireOwnProfile();
        TechnicianWork work = p.getWorks().stream()
                .filter(w -> w.getId().equals(workId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Trabajo no encontrado: " + workId));
        cloudinaryService.deleteByPublicId(work.getPublicId());
        p.getWorks().remove(work);
        p.setPerfilCompletitud(ProfileCompletion.calcular(p));
        technicianRepository.save(p);
    }

    // ---- helpers ----

    private TechnicianDetailDTO buildDetail(TechnicianProfile p, boolean includePhone) {
        List<String> zonas = mapper.zonas(p);
        List<WorkDTO> works = p.getWorks().stream().map(mapper::toWorkDTO).toList();
        List<ReviewDTO> resenas = reviewRepository.findByTecnicoIdOrderByCreatedAtDesc(p.getId()).stream()
                .map(mapper::toReviewDTO).toList();

        return new TechnicianDetailDTO(
                p.getId(), p.getUser().getId(), p.getUser().getNombre(),
                p.getEspecialidad().name(), p.getExperienciaAnios(), p.getBio(),
                p.getTarifaDesde(), p.getTiempoRespuesta(), p.getGarantiaDias(),
                p.getDisponible(), p.getVerificado(), p.getRatingPromedio(),
                p.getTotalResenas(), p.getFotoUrl(), p.getPerfilCompletitud(),
                includePhone ? p.getTelefono() : null,
                zonas, works, resenas
        );
    }

    private void replaceZones(TechnicianProfile p, List<String> zonas) {
        p.getZonas().clear();
        for (String d : zonas) {
            if (d != null && !d.isBlank()) {
                p.getZonas().add(TechnicianZone.builder().tecnico(p).distrito(d).build());
            }
        }
    }

    private TechnicianProfile requireOwnProfile() {
        User user = currentUser.getCurrentUser();
        if (user.getRol() != Rol.TECNICO) {
            throw new UnauthorizedException("Solo los tecnicos pueden acceder a este recurso");
        }
        return technicianRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("El usuario no tiene un perfil de tecnico"));
    }
}
