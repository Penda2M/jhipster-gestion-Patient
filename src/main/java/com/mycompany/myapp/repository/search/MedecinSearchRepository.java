package com.mycompany.myapp.repository.search;

import com.mycompany.myapp.domain.Medecin;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Medecin} entity.
 */
public interface MedecinSearchRepository extends ElasticsearchRepository<Medecin, Long> {}
