package com.tecnihogar.repository;

import com.tecnihogar.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByTecnicoIdOrderByCreatedAtDesc(Long tecnicoId);

    boolean existsByRequestId(Long requestId);

    java.util.Optional<Review> findByRequestId(Long requestId);

    @Query("SELECT AVG(r.estrellas) FROM Review r WHERE r.tecnico.id = :tecnicoId")
    Double findAverageRatingByTecnicoId(@Param("tecnicoId") Long tecnicoId);

    long countByTecnicoId(Long tecnicoId);
}
