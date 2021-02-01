package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Ordonnance;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Ordonnance entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrdonnanceRepository extends JpaRepository<Ordonnance, Long> {}
