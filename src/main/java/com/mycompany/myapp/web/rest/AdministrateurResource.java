package com.mycompany.myapp.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.*;

import com.mycompany.myapp.domain.Administrateur;
import com.mycompany.myapp.repository.AdministrateurRepository;
import com.mycompany.myapp.repository.search.AdministrateurSearchRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Administrateur}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AdministrateurResource {
    private final Logger log = LoggerFactory.getLogger(AdministrateurResource.class);

    private static final String ENTITY_NAME = "administrateur";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AdministrateurRepository administrateurRepository;

    private final AdministrateurSearchRepository administrateurSearchRepository;

    public AdministrateurResource(
        AdministrateurRepository administrateurRepository,
        AdministrateurSearchRepository administrateurSearchRepository
    ) {
        this.administrateurRepository = administrateurRepository;
        this.administrateurSearchRepository = administrateurSearchRepository;
    }

    /**
     * {@code POST  /administrateurs} : Create a new administrateur.
     *
     * @param administrateur the administrateur to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new administrateur, or with status {@code 400 (Bad Request)} if the administrateur has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/administrateurs")
    public ResponseEntity<Administrateur> createAdministrateur(@RequestBody Administrateur administrateur) throws URISyntaxException {
        log.debug("REST request to save Administrateur : {}", administrateur);
        if (administrateur.getId() != null) {
            throw new BadRequestAlertException("A new administrateur cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Administrateur result = administrateurRepository.save(administrateur);
        administrateurSearchRepository.save(result);
        return ResponseEntity
            .created(new URI("/api/administrateurs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /administrateurs} : Updates an existing administrateur.
     *
     * @param administrateur the administrateur to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated administrateur,
     * or with status {@code 400 (Bad Request)} if the administrateur is not valid,
     * or with status {@code 500 (Internal Server Error)} if the administrateur couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/administrateurs")
    public ResponseEntity<Administrateur> updateAdministrateur(@RequestBody Administrateur administrateur) throws URISyntaxException {
        log.debug("REST request to update Administrateur : {}", administrateur);
        if (administrateur.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Administrateur result = administrateurRepository.save(administrateur);
        administrateurSearchRepository.save(result);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, administrateur.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /administrateurs} : get all the administrateurs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of administrateurs in body.
     */
    @GetMapping("/administrateurs")
    public List<Administrateur> getAllAdministrateurs() {
        log.debug("REST request to get all Administrateurs");
        return administrateurRepository.findAll();
    }

    /**
     * {@code GET  /administrateurs/:id} : get the "id" administrateur.
     *
     * @param id the id of the administrateur to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the administrateur, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/administrateurs/{id}")
    public ResponseEntity<Administrateur> getAdministrateur(@PathVariable Long id) {
        log.debug("REST request to get Administrateur : {}", id);
        Optional<Administrateur> administrateur = administrateurRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(administrateur);
    }

    /**
     * {@code DELETE  /administrateurs/:id} : delete the "id" administrateur.
     *
     * @param id the id of the administrateur to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/administrateurs/{id}")
    public ResponseEntity<Void> deleteAdministrateur(@PathVariable Long id) {
        log.debug("REST request to delete Administrateur : {}", id);
        administrateurRepository.deleteById(id);
        administrateurSearchRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/administrateurs?query=:query} : search for the administrateur corresponding
     * to the query.
     *
     * @param query the query of the administrateur search.
     * @return the result of the search.
     */
    @GetMapping("/_search/administrateurs")
    public List<Administrateur> searchAdministrateurs(@RequestParam String query) {
        log.debug("REST request to search Administrateurs for query {}", query);
        return StreamSupport
            .stream(administrateurSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
