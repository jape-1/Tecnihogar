package com.tecnihogar.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "technician_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"zonas", "works"})
@EqualsAndHashCode(exclude = {"zonas", "works"})
public class TechnicianProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Especialidad especialidad;

    @Column(name = "experiencia_anios")
    private Integer experienciaAnios;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "tarifa_desde")
    private BigDecimal tarifaDesde;

    @Column(name = "tiempo_respuesta", length = 50)
    private String tiempoRespuesta;

    @Column(name = "garantia_dias")
    private Integer garantiaDias;

    @Builder.Default
    private Boolean disponible = true;

    @Builder.Default
    private Boolean verificado = false;

    @Column(name = "rating_promedio")
    private BigDecimal ratingPromedio;

    @Column(name = "total_resenas")
    private Integer totalResenas;

    @Column(name = "foto_url", length = 500)
    private String fotoUrl;

    @Column(name = "perfil_completitud")
    private Integer perfilCompletitud;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Builder.Default
    @OneToMany(mappedBy = "tecnico", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TechnicianZone> zonas = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "tecnico", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TechnicianWork> works = new ArrayList<>();

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
