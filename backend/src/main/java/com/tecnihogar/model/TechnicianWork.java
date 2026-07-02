package com.tecnihogar.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "technician_works")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "tecnico")
@EqualsAndHashCode(exclude = "tecnico")
public class TechnicianWork {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tecnico_id", nullable = false)
    private TechnicianProfile tecnico;

    @Column(name = "imagen_url", nullable = false, length = 500)
    private String imagenUrl;

    @Column(length = 200)
    private String descripcion;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
