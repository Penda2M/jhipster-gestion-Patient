package com.mycompany.myapp.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.*;

import com.mycompany.myapp.domain.Ordonnance;
import com.mycompany.myapp.repository.OrdonnanceRepository;
import com.mycompany.myapp.repository.search.OrdonnanceSearchRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Ordonnance}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OrdonnanceResource {
    private final Logger log = LoggerFactory.getLogger(OrdonnanceResource.class);

    private static final String ENTITY_NAME = "ordonnance";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrdonnanceRepository ordonnanceRepository;

    private final OrdonnanceSearchRepository ordonnanceSearchRepository;

    public OrdonnanceResource(OrdonnanceRepository ordonnanceRepository, OrdonnanceSearchRepository ordonnanceSearchRepository) {
        this.ordonnanceRepository = ordonnanceRepository;
        this.ordonnanceSearchRepository = ordonnanceSearchRepository;
    }

    /**
     * {@code POST  /ordonnances} : Create a new ordonnance.
     *
     * @param ordonnance the ordonnance to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ordonnance, or with status {@code 400 (Bad Request)} if the ordonnance has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ordonnances")
    public ResponseEntity<Ordonnance> createOrdonnance(@RequestBody Ordonnance ordonnance) throws URISyntaxException {
        log.debug("REST request to save Ordonnance : {}", ordonnance);
        if (ordonnance.getId() != null) {
            throw new BadRequestAlertException("A new ordonnance cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Ordonnance result = ordonnanceRepository.save(ordonnance);
        ordonnanceSearchRepository.save(result);
        return ResponseEntity
            .created(new URI("/api/ordonnances/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ordonnances} : Updates an existing ordonnance.
     *
     * @param ordonnance the ordonnance to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ordonnance,
     * or with status {@code 400 (Bad Request)} if the ordonnance is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ordonnance couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ordonnances")
    public ResponseEntity<Ordonnance> updateOrdonnance(@RequestBody Ordonnance ordonnance) throws URISyntaxException {
        log.debug("REST request to update Ordonnance : {}", ordonnance);
        if (ordonnance.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Ordonnance result = ordonnanceRepository.save(ordonnance);
        ordonnanceSearchRepository.save(result);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ordonnance.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /ordonnances} : get all the ordonnances.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ordonnances in body.
     */
    @GetMapping("/ordonnances")
    public List<Ordonnance> getAllOrdonnances() {
        log.debug("REST request to get all Ordonnances");
        return ordonnanceRepository.findAll();
    }

    /**
     * {@code GET  /ordonnances/:id} : get the "id" ordonnance.
     *
     * @param id the id of the ordonnance to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ordonnance, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ordonnances/{id}")
    public ResponseEntity<Ordonnance> getOrdonnance(@PathVariable Long id) {
        log.debug("REST request to get Ordonnance : {}", id);
        Optional<Ordonnance> ordonnance = ordonnanceRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(ordonnance);
    }

    /**
     * {@code DELETE  /ordonnances/:id} : delete the "id" ordonnance.
     *
     * @param id the id of the ordonnance to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ordonnances/{id}")
    public ResponseEntity<Void> deleteOrdonnance(@PathVariable Long id) {
        log.debug("REST request to delete Ordonnance : {}", id);
        ordonnanceRepository.deleteById(id);
        ordonnanceSearchRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/ordonnances?query=:query} : search for the ordonnance corresponding
     * to the query.
     *
     * @param query the query of the ordonnance search.
     * @return the result of the search.
     */
    @GetMapping("/_search/ordonnances")
    public List<Ordonnance> searchOrdonnances(@RequestParam String query) {
        log.debug("REST request to search Ordonnances for query {}", query);
        return StreamSupport
            .stream(ordonnanceSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
