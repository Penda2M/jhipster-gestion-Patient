package com.mycompany.myapp.repository.search;

import com.mycompany.myapp.domain.Medicament;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Medicament} entity.
 */
public interface MedicamentSearchRepository extends ElasticsearchRepository<Medicament, Long> {}
