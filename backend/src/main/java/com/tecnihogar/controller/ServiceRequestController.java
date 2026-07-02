package com.tecnihogar.controller;

import com.tecnihogar.dto.request.ServiceRequestCreateDTO;
import com.tecnihogar.dto.request.ServiceRequestDTO;
import com.tecnihogar.dto.request.StatusUpdateDTO;
import com.tecnihogar.service.ServiceRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class ServiceRequestController {

    private final ServiceRequestService requestService;

    @PostMapping
    public ResponseEntity<ServiceRequestDTO> create(@Valid @RequestBody ServiceRequestCreateDTO dto) {
        return ResponseEntity.ok(requestService.create(dto));
    }

    @GetMapping("/my")
    public List<ServiceRequestDTO> myRequests() {
        return requestService.myRequests();
    }

    @GetMapping("/incoming")
    public List<ServiceRequestDTO> incoming() {
        return requestService.incomingRequests();
    }

    @GetMapping("/{id}")
    public ServiceRequestDTO getById(@PathVariable Long id) {
        return requestService.getById(id);
    }

    @PatchMapping("/{id}/status")
    public ServiceRequestDTO updateStatus(@PathVariable Long id, @Valid @RequestBody StatusUpdateDTO dto) {
        return requestService.updateStatus(id, dto.estado());
    }
}
