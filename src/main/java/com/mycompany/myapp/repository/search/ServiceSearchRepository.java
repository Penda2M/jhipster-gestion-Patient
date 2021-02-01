package com.mycompany.myapp.repository.search;

import com.mycompany.myapp.domain.Service;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Service} entity.
 */
public interface ServiceSearchRepository extends ElasticsearchRepository<Service, Long> {}
