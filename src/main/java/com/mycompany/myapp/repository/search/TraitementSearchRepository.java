package com.mycompany.myapp.repository.search;

import com.mycompany.myapp.domain.Traitement;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Traitement} entity.
 */
public interface TraitementSearchRepository extends ElasticsearchRepository<Traitement, Long> {}
