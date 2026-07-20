package com.tecnihogar.controller;

import com.tecnihogar.dto.request.ServiceRequestCreateDTO;
import com.tecnihogar.dto.request.ServiceRequestDTO;
import com.tecnihogar.dto.request.StatusUpdateDTO;
import com.tecnihogar.dto.stats.StatsDTO;
import com.tecnihogar.service.ServiceRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
@Tag(name = "Solicitudes", description = "Solicitudes de servicio, estado y estadisticas del panel")
public class ServiceRequestController {

    private final ServiceRequestService requestService;

    @PostMapping
    @Operation(summary = "Crear una solicitud de servicio (cliente)")
    public ResponseEntity<ServiceRequestDTO> create(@Valid @RequestBody ServiceRequestCreateDTO dto) {
        return ResponseEntity.ok(requestService.create(dto));
    }

    @GetMapping("/my")
    @Operation(summary = "Mis solicitudes (cliente)")
    public List<ServiceRequestDTO> myRequests() {
        return requestService.myRequests();
    }

    @GetMapping("/incoming")
    @Operation(summary = "Solicitudes entrantes (tecnico)")
    public List<ServiceRequestDTO> incoming() {
        return requestService.incomingRequests();
    }

    @GetMapping("/stats")
    @Operation(summary = "Estadisticas del panel (se adapta al rol del usuario)")
    public StatsDTO stats() {
        return requestService.stats();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Detalle de una solicitud (solo las partes involucradas)")
    public ServiceRequestDTO getById(@PathVariable Long id) {
        return requestService.getById(id);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Cambiar el estado de una solicitud (tecnico)")
    public ServiceRequestDTO updateStatus(@PathVariable Long id, @Valid @RequestBody StatusUpdateDTO dto) {
        return requestService.updateStatus(id, dto.estado());
    }
}
