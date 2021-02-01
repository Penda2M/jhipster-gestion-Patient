package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Traitement;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Traitement entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TraitementRepository extends JpaRepository<Traitement, Long> {}
