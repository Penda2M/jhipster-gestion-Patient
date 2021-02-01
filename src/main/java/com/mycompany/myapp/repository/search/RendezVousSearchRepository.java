package com.mycompany.myapp.repository.search;

import com.mycompany.myapp.domain.RendezVous;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link RendezVous} entity.
 */
public interface RendezVousSearchRepository extends ElasticsearchRepository<RendezVous, Long> {}
