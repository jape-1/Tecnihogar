package com.tecnihogar.controller;

import com.tecnihogar.dto.technician.AvailabilityDTO;
import com.tecnihogar.dto.technician.TechnicianDetailDTO;
import com.tecnihogar.dto.technician.TechnicianListDTO;
import com.tecnihogar.dto.technician.TechnicianUpdateDTO;
import com.tecnihogar.dto.technician.WorkDTO;
import com.tecnihogar.dto.technician.ZonesDTO;
import com.tecnihogar.service.TechnicianService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/technicians")
@RequiredArgsConstructor
@Tag(name = "Tecnicos", description = "Busqueda, perfil publico y gestion del perfil propio")
public class TechnicianController {

    private final TechnicianService technicianService;

    @GetMapping
    @Operation(summary = "Buscar tecnicos con filtros (especialidad, distrito, rating, etc.)")
    public List<TechnicianListDTO> search(
            @RequestParam(required = false) String especialidad,
            @RequestParam(required = false) String distrito,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false, name = "rating") Double rating,
            @RequestParam(required = false) Boolean verificado,
            @RequestParam(required = false) Boolean disponible) {
        Double min = minRating != null ? minRating : rating;
        return technicianService.search(especialidad, distrito, min, verificado, disponible);
    }

    @GetMapping("/featured")
    @Operation(summary = "Tecnicos destacados (top por rating)")
    public List<TechnicianListDTO> featured() {
        return technicianService.featured();
    }

    @GetMapping("/me")
    @Operation(summary = "Perfil del tecnico autenticado")
    public TechnicianDetailDTO myProfile() {
        return technicianService.getMyProfile();
    }

    @PutMapping("/me")
    @Operation(summary = "Actualizar los datos del perfil propio")
    public TechnicianDetailDTO updateMyProfile(@Valid @RequestBody TechnicianUpdateDTO dto) {
        return technicianService.updateMyProfile(dto);
    }

    @PutMapping("/me/zones")
    @Operation(summary = "Actualizar las zonas de atencion")
    public Map<String, List<String>> updateZones(@Valid @RequestBody ZonesDTO dto) {
        return Map.of("zonas", technicianService.updateZones(dto.zonas()));
    }

    @PatchMapping("/me/availability")
    @Operation(summary = "Cambiar la disponibilidad del tecnico")
    public Map<String, Boolean> updateAvailability(@Valid @RequestBody AvailabilityDTO dto) {
        boolean disponible = technicianService.updateAvailability(dto.disponible());
        return Map.of("disponible", disponible);
    }

    @PostMapping("/me/photo")
    @Operation(summary = "Subir/cambiar la foto de perfil (Cloudinary)")
    public Map<String, String> uploadPhoto(@RequestParam("file") MultipartFile file) throws IOException {
        return Map.of("fotoUrl", technicianService.updatePhoto(file));
    }

    @PostMapping("/me/works")
    @Operation(summary = "Agregar una foto a la galeria de trabajos")
    public ResponseEntity<WorkDTO> addWork(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "descripcion", required = false) String descripcion) throws IOException {
        return ResponseEntity.ok(technicianService.addWork(file, descripcion));
    }

    @DeleteMapping("/me/works/{id}")
    @Operation(summary = "Eliminar una foto de la galeria de trabajos")
    public ResponseEntity<Void> deleteWork(@PathVariable Long id) {
        technicianService.deleteWork(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Perfil publico de un tecnico (zonas, trabajos y resenas)")
    public TechnicianDetailDTO getById(@PathVariable Long id) {
        return technicianService.getById(id);
    }
}
