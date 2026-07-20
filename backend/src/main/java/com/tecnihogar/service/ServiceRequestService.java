package com.tecnihogar.service;

import com.tecnihogar.dto.request.ServiceRequestCreateDTO;
import com.tecnihogar.dto.request.ServiceRequestDTO;
import com.tecnihogar.dto.stats.MonthCountDTO;
import com.tecnihogar.dto.stats.StatsDTO;
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
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceRequestService {

    private final ServiceRequestRepository requestRepository;
    private final TechnicianProfileRepository technicianRepository;
    private final ReviewRepository reviewRepository;
    private final NotificationService notificationService;
    private final CurrentUserProvider currentUser;
    private final DtoMapper mapper;

    @Transactional
    public ServiceRequestDTO create(ServiceRequestCreateDTO dto) {
        User cliente = currentUser.getCurrentUser();
        if (cliente.getRol() != Rol.CLIENTE) {
            throw new UnauthorizedException("Solo los clientes pueden crear solicitudes");
        }
        TechnicianProfile tecnico = technicianRepository.findById(dto.tecnicoId())
                .orElseThrow(() -> new ResourceNotFoundException("Tecnico no encontrado: " + dto.tecnicoId()));

        ServiceRequest req = ServiceRequest.builder()
                .codigoReferencia("TH-TEMP")
                .cliente(cliente)
                .tecnico(tecnico)
                .tipoServicio(dto.tipoServicio())
                .descripcion(dto.descripcion())
                .direccion(dto.direccion())
                .distrito(dto.distrito())
                .fechaPreferida(dto.fechaPreferida())
                .horaPreferida(dto.horaPreferida())
                .estado(EstadoSolicitud.PENDIENTE)
                .build();
        req = requestRepository.save(req);

        // Generar codigo de referencia con el id ya asignado
        req.setCodigoReferencia("TH-" + String.format("%05d", req.getId()));
        req = requestRepository.save(req);

        // Notificar al tecnico
        notificationService.notify(tecnico.getUser(),
                "Nueva solicitud de servicio " + req.getCodigoReferencia() + " de " + cliente.getNombre(),
                "SOLICITUD_NUEVA");

        return mapper.toRequestDTO(req, phoneFor(req), false);
    }

    @Transactional(readOnly = true)
    public List<ServiceRequestDTO> myRequests() {
        User cliente = currentUser.getCurrentUser();
        return requestRepository.findByClienteIdOrderByCreatedAtDesc(cliente.getId()).stream()
                .map(r -> mapper.toRequestDTO(r, phoneFor(r), reviewRepository.existsByRequestId(r.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ServiceRequestDTO> incomingRequests() {
        User user = currentUser.getCurrentUser();
        if (user.getRol() != Rol.TECNICO) {
            throw new UnauthorizedException("Solo los tecnicos pueden ver solicitudes entrantes");
        }
        TechnicianProfile p = technicianRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("El usuario no tiene un perfil de tecnico"));
        return requestRepository.findByTecnicoIdOrderByCreatedAtDesc(p.getId()).stream()
                .map(r -> mapper.toRequestDTO(r, phoneFor(r), reviewRepository.existsByRequestId(r.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public ServiceRequestDTO getById(Long id) {
        User user = currentUser.getCurrentUser();
        ServiceRequest req = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada: " + id));
        requireInvolved(req, user);
        return mapper.toRequestDTO(req, phoneFor(req), reviewRepository.existsByRequestId(req.getId()));
    }

    @Transactional
    public ServiceRequestDTO updateStatus(Long id, EstadoSolicitud nuevoEstado) {
        User user = currentUser.getCurrentUser();
        if (user.getRol() != Rol.TECNICO) {
            throw new UnauthorizedException("Solo el tecnico puede cambiar el estado");
        }
        ServiceRequest req = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada: " + id));

        if (!req.getTecnico().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("No puedes modificar solicitudes de otro tecnico");
        }

        req.setEstado(nuevoEstado);
        req = requestRepository.save(req);

        // Notificaciones segun el nuevo estado
        switch (nuevoEstado) {
            case ACEPTADA -> notificationService.notify(req.getCliente(),
                    req.getTecnico().getUser().getNombre() + " acepto tu solicitud " + req.getCodigoReferencia(),
                    "SOLICITUD_ACEPTADA");
            case CANCELADA -> notificationService.notify(req.getCliente(),
                    "Tu solicitud " + req.getCodigoReferencia() + " fue rechazada.",
                    "SOLICITUD_RECHAZADA");
            case FINALIZADA -> notificationService.notify(req.getCliente(),
                    "Tu servicio " + req.getCodigoReferencia() + " fue finalizado. Deja una resena a "
                            + req.getTecnico().getUser().getNombre() + ".",
                    "SERVICIO_FINALIZADO");
            default -> { /* EN_CURSO / PENDIENTE: sin notificacion */ }
        }

        return mapper.toRequestDTO(req, phoneFor(req), reviewRepository.existsByRequestId(req.getId()));
    }

    @Transactional(readOnly = true)
    public StatsDTO stats() {
        User user = currentUser.getCurrentUser();
        List<ServiceRequest> reqs;
        BigDecimal ratingPromedio = null;
        Integer totalResenas = null;

        if (user.getRol() == Rol.TECNICO) {
            TechnicianProfile p = technicianRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new BadRequestException("El usuario no tiene un perfil de tecnico"));
            reqs = requestRepository.findByTecnicoIdOrderByCreatedAtDesc(p.getId());
            ratingPromedio = p.getRatingPromedio() == null ? BigDecimal.ZERO : p.getRatingPromedio();
            totalResenas = p.getTotalResenas() == null ? 0 : p.getTotalResenas();
        } else {
            reqs = requestRepository.findByClienteIdOrderByCreatedAtDesc(user.getId());
        }

        long total = reqs.size();
        long activas = reqs.stream().filter(r -> switch (r.getEstado()) {
            case PENDIENTE, ACEPTADA, EN_CURSO -> true;
            default -> false;
        }).count();
        long completadas = reqs.stream().filter(r -> r.getEstado() == EstadoSolicitud.FINALIZADA).count();
        long canceladas = reqs.stream().filter(r -> r.getEstado() == EstadoSolicitud.CANCELADA).count();

        // Monto estimado: suma de la tarifa base del tecnico por cada servicio finalizado.
        BigDecimal montoEstimado = reqs.stream()
                .filter(r -> r.getEstado() == EstadoSolicitud.FINALIZADA)
                .map(r -> r.getTecnico().getTarifaDesde() == null ? BigDecimal.ZERO : r.getTecnico().getTarifaDesde())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new StatsDTO(total, activas, completadas, canceladas,
                ratingPromedio, totalResenas, montoEstimado, buildPorMes(reqs));
    }

    // Servicios finalizados por mes durante los ultimos 6 meses (para el grafico del panel)
    private List<MonthCountDTO> buildPorMes(List<ServiceRequest> reqs) {
        String[] meses = {"Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"};
        YearMonth now = YearMonth.now();
        List<MonthCountDTO> out = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth ym = now.minusMonths(i);
            long count = reqs.stream()
                    .filter(r -> r.getEstado() == EstadoSolicitud.FINALIZADA)
                    .filter(r -> r.getUpdatedAt() != null && YearMonth.from(r.getUpdatedAt()).equals(ym))
                    .count();
            out.add(new MonthCountDTO(meses[ym.getMonthValue() - 1], count));
        }
        return out;
    }

    private void requireInvolved(ServiceRequest req, User user) {
        boolean esCliente = req.getCliente().getId().equals(user.getId());
        boolean esTecnico = req.getTecnico().getUser().getId().equals(user.getId());
        if (!esCliente && !esTecnico) {
            throw new UnauthorizedException("No tienes acceso a esta solicitud");
        }
    }

    // El telefono se revela completo solo cuando el servicio esta EN_CURSO o FINALIZADA;
    // en PENDIENTE / ACEPTADA se muestra parcialmente oculto.
    private String phoneFor(ServiceRequest req) {
        String tel = req.getTecnico().getTelefono();
        if (tel == null || tel.isBlank()) return "No disponible";
        EstadoSolicitud e = req.getEstado();
        if (e == EstadoSolicitud.EN_CURSO || e == EstadoSolicitud.FINALIZADA) {
            return tel;
        }
        String digits = tel.replaceAll("\\D", "");
        String last3 = digits.length() >= 3 ? digits.substring(digits.length() - 3) : digits;
        return "+51 9XX XXX " + last3;
    }
}
