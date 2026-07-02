package com.tecnihogar.service;

import com.tecnihogar.dto.report.ReportCreateDTO;
import com.tecnihogar.exception.ResourceNotFoundException;
import com.tecnihogar.exception.UnauthorizedException;
import com.tecnihogar.model.Report;
import com.tecnihogar.model.ServiceRequest;
import com.tecnihogar.model.User;
import com.tecnihogar.repository.ReportRepository;
import com.tecnihogar.repository.ServiceRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final ServiceRequestRepository requestRepository;
    private final CurrentUserProvider currentUser;

    @Transactional
    public Long create(ReportCreateDTO dto) {
        User cliente = currentUser.getCurrentUser();
        ServiceRequest req = requestRepository.findById(dto.requestId())
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada: " + dto.requestId()));

        if (!req.getCliente().getId().equals(cliente.getId())) {
            throw new UnauthorizedException("Solo puedes reportar tus propias solicitudes");
        }

        Report report = Report.builder()
                .request(req)
                .cliente(cliente)
                .tipoIncidente(dto.tipoIncidente())
                .descripcion(dto.descripcion())
                .build();
        return reportRepository.save(report).getId();
    }
}
