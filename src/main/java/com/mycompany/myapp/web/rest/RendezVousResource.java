package com.mycompany.myapp.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.*;

import com.mycompany.myapp.domain.RendezVous;
import com.mycompany.myapp.repository.RendezVousRepository;
import com.mycompany.myapp.repository.search.RendezVousSearchRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.RendezVous}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RendezVousResource {
    private final Logger log = LoggerFactory.getLogger(RendezVousResource.class);

    private static final String ENTITY_NAME = "rendezVous";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RendezVousRepository rendezVousRepository;

    private final RendezVousSearchRepository rendezVousSearchRepository;

    public RendezVousResource(RendezVousRepository rendezVousRepository, RendezVousSearchRepository rendezVousSearchRepository) {
        this.rendezVousRepository = rendezVousRepository;
        this.rendezVousSearchRepository = rendezVousSearchRepository;
    }

    /**
     * {@code POST  /rendez-vous} : Create a new rendezVous.
     *
     * @param rendezVous the rendezVous to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new rendezVous, or with status {@code 400 (Bad Request)} if the rendezVous has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/rendez-vous")
    public ResponseEntity<RendezVous> createRendezVous(@RequestBody RendezVous rendezVous) throws URISyntaxException {
        log.debug("REST request to save RendezVous : {}", rendezVous);
        if (rendezVous.getId() != null) {
            throw new BadRequestAlertException("A new rendezVous cannot already have an ID", ENTITY_NAME, "idexists");
        }
        RendezVous result = rendezVousRepository.save(rendezVous);
        rendezVousSearchRepository.save(result);
        return ResponseEntity
            .created(new URI("/api/rendez-vous/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /rendez-vous} : Updates an existing rendezVous.
     *
     * @param rendezVous the rendezVous to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rendezVous,
     * or with status {@code 400 (Bad Request)} if the rendezVous is not valid,
     * or with status {@code 500 (Internal Server Error)} if the rendezVous couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/rendez-vous")
    public ResponseEntity<RendezVous> updateRendezVous(@RequestBody RendezVous rendezVous) throws URISyntaxException {
        log.debug("REST request to update RendezVous : {}", rendezVous);
        if (rendezVous.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        RendezVous result = rendezVousRepository.save(rendezVous);
        rendezVousSearchRepository.save(result);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rendezVous.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /rendez-vous} : get all the rendezVous.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of rendezVous in body.
     */
    @GetMapping("/rendez-vous")
    public List<RendezVous> getAllRendezVous() {
        log.debug("REST request to get all RendezVous");
        return rendezVousRepository.findAll();
    }

    /**
     * {@code GET  /rendez-vous/:id} : get the "id" rendezVous.
     *
     * @param id the id of the rendezVous to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the rendezVous, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/rendez-vous/{id}")
    public ResponseEntity<RendezVous> getRendezVous(@PathVariable Long id) {
        log.debug("REST request to get RendezVous : {}", id);
        Optional<RendezVous> rendezVous = rendezVousRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(rendezVous);
    }

    /**
     * {@code DELETE  /rendez-vous/:id} : delete the "id" rendezVous.
     *
     * @param id the id of the rendezVous to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/rendez-vous/{id}")
    public ResponseEntity<Void> deleteRendezVous(@PathVariable Long id) {
        log.debug("REST request to delete RendezVous : {}", id);
        rendezVousRepository.deleteById(id);
        rendezVousSearchRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/rendez-vous?query=:query} : search for the rendezVous corresponding
     * to the query.
     *
     * @param query the query of the rendezVous search.
     * @return the result of the search.
     */
    @GetMapping("/_search/rendez-vous")
    public List<RendezVous> searchRendezVous(@RequestParam String query) {
        log.debug("REST request to search RendezVous for query {}", query);
        return StreamSupport
            .stream(rendezVousSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
