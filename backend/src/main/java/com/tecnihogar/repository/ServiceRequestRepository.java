package com.tecnihogar.repository;

import com.tecnihogar.model.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    List<ServiceRequest> findByClienteIdOrderByCreatedAtDesc(Long clienteId);

    List<ServiceRequest> findByTecnicoIdOrderByCreatedAtDesc(Long tecnicoId);

    long countByTecnicoIdAndEstado(Long tecnicoId, com.tecnihogar.model.EstadoSolicitud estado);
}
