package com.tecnihogar.repository;

import com.tecnihogar.model.TechnicianProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface TechnicianProfileRepository
        extends JpaRepository<TechnicianProfile, Long>, JpaSpecificationExecutor<TechnicianProfile> {

    Optional<TechnicianProfile> findByUserId(Long userId);

    List<TechnicianProfile> findTop3ByVerificadoTrueOrderByRatingPromedioDesc();
}
