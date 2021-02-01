package com.mycompany.myapp.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.*;

import com.mycompany.myapp.domain.Traitement;
import com.mycompany.myapp.repository.TraitementRepository;
import com.mycompany.myapp.repository.search.TraitementSearchRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Traitement}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TraitementResource {
    private final Logger log = LoggerFactory.getLogger(TraitementResource.class);

    private static final String ENTITY_NAME = "traitement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TraitementRepository traitementRepository;

    private final TraitementSearchRepository traitementSearchRepository;

    public TraitementResource(TraitementRepository traitementRepository, TraitementSearchRepository traitementSearchRepository) {
        this.traitementRepository = traitementRepository;
        this.traitementSearchRepository = traitementSearchRepository;
    }

    /**
     * {@code POST  /traitements} : Create a new traitement.
     *
     * @param traitement the traitement to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new traitement, or with status {@code 400 (Bad Request)} if the traitement has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/traitements")
    public ResponseEntity<Traitement> createTraitement(@RequestBody Traitement traitement) throws URISyntaxException {
        log.debug("REST request to save Traitement : {}", traitement);
        if (traitement.getId() != null) {
            throw new BadRequestAlertException("A new traitement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Traitement result = traitementRepository.save(traitement);
        traitementSearchRepository.save(result);
        return ResponseEntity
            .created(new URI("/api/traitements/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /traitements} : Updates an existing traitement.
     *
     * @param traitement the traitement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated traitement,
     * or with status {@code 400 (Bad Request)} if the traitement is not valid,
     * or with status {@code 500 (Internal Server Error)} if the traitement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/traitements")
    public ResponseEntity<Traitement> updateTraitement(@RequestBody Traitement traitement) throws URISyntaxException {
        log.debug("REST request to update Traitement : {}", traitement);
        if (traitement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Traitement result = traitementRepository.save(traitement);
        traitementSearchRepository.save(result);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, traitement.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /traitements} : get all the traitements.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of traitements in body.
     */
    @GetMapping("/traitements")
    public List<Traitement> getAllTraitements() {
        log.debug("REST request to get all Traitements");
        return traitementRepository.findAll();
    }

    /**
     * {@code GET  /traitements/:id} : get the "id" traitement.
     *
     * @param id the id of the traitement to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the traitement, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/traitements/{id}")
    public ResponseEntity<Traitement> getTraitement(@PathVariable Long id) {
        log.debug("REST request to get Traitement : {}", id);
        Optional<Traitement> traitement = traitementRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(traitement);
    }

    /**
     * {@code DELETE  /traitements/:id} : delete the "id" traitement.
     *
     * @param id the id of the traitement to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/traitements/{id}")
    public ResponseEntity<Void> deleteTraitement(@PathVariable Long id) {
        log.debug("REST request to delete Traitement : {}", id);
        traitementRepository.deleteById(id);
        traitementSearchRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/traitements?query=:query} : search for the traitement corresponding
     * to the query.
     *
     * @param query the query of the traitement search.
     * @return the result of the search.
     */
    @GetMapping("/_search/traitements")
    public List<Traitement> searchTraitements(@RequestParam String query) {
        log.debug("REST request to search Traitements for query {}", query);
        return StreamSupport
            .stream(traitementSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
