package com.mycompany.myapp.repository.search;

import com.mycompany.myapp.domain.Ordonnance;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Ordonnance} entity.
 */
public interface OrdonnanceSearchRepository extends ElasticsearchRepository<Ordonnance, Long> {}
