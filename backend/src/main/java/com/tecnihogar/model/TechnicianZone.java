package com.tecnihogar.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "technician_zones")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "tecnico")
@EqualsAndHashCode(exclude = "tecnico")
public class TechnicianZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tecnico_id", nullable = false)
    private TechnicianProfile tecnico;

    @Column(nullable = false, length = 100)
    private String distrito;
}
