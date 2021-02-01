package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.GestionPatientApp;
import com.mycompany.myapp.domain.Traitement;
import com.mycompany.myapp.repository.TraitementRepository;
import com.mycompany.myapp.repository.search.TraitementSearchRepository;
import java.util.Collections;
import java.util.List;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TraitementResource} REST controller.
 */
@SpringBootTest(classes = GestionPatientApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class TraitementResourceIT {
    private static final Long DEFAULT_ID_TRAITEMENT = 1L;
    private static final Long UPDATED_ID_TRAITEMENT = 2L;

    private static final Long DEFAULT_FRAIS = 1L;
    private static final Long UPDATED_FRAIS = 2L;

    @Autowired
    private TraitementRepository traitementRepository;

    /**
     * This repository is mocked in the com.mycompany.myapp.repository.search test package.
     *
     * @see com.mycompany.myapp.repository.search.TraitementSearchRepositoryMockConfiguration
     */
    @Autowired
    private TraitementSearchRepository mockTraitementSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTraitementMockMvc;

    private Traitement traitement;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Traitement createEntity(EntityManager em) {
        Traitement traitement = new Traitement().idTraitement(DEFAULT_ID_TRAITEMENT).frais(DEFAULT_FRAIS);
        return traitement;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Traitement createUpdatedEntity(EntityManager em) {
        Traitement traitement = new Traitement().idTraitement(UPDATED_ID_TRAITEMENT).frais(UPDATED_FRAIS);
        return traitement;
    }

    @BeforeEach
    public void initTest() {
        traitement = createEntity(em);
    }

    @Test
    @Transactional
    public void createTraitement() throws Exception {
        int databaseSizeBeforeCreate = traitementRepository.findAll().size();
        // Create the Traitement
        restTraitementMockMvc
            .perform(
                post("/api/traitements").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(traitement))
            )
            .andExpect(status().isCreated());

        // Validate the Traitement in the database
        List<Traitement> traitementList = traitementRepository.findAll();
        assertThat(traitementList).hasSize(databaseSizeBeforeCreate + 1);
        Traitement testTraitement = traitementList.get(traitementList.size() - 1);
        assertThat(testTraitement.getIdTraitement()).isEqualTo(DEFAULT_ID_TRAITEMENT);
        assertThat(testTraitement.getFrais()).isEqualTo(DEFAULT_FRAIS);

        // Validate the Traitement in Elasticsearch
        verify(mockTraitementSearchRepository, times(1)).save(testTraitement);
    }

    @Test
    @Transactional
    public void createTraitementWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = traitementRepository.findAll().size();

        // Create the Traitement with an existing ID
        traitement.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTraitementMockMvc
            .perform(
                post("/api/traitements").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(traitement))
            )
            .andExpect(status().isBadRequest());

        // Validate the Traitement in the database
        List<Traitement> traitementList = traitementRepository.findAll();
        assertThat(traitementList).hasSize(databaseSizeBeforeCreate);

        // Validate the Traitement in Elasticsearch
        verify(mockTraitementSearchRepository, times(0)).save(traitement);
    }

    @Test
    @Transactional
    public void getAllTraitements() throws Exception {
        // Initialize the database
        traitementRepository.saveAndFlush(traitement);

        // Get all the traitementList
        restTraitementMockMvc
            .perform(get("/api/traitements?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(traitement.getId().intValue())))
            .andExpect(jsonPath("$.[*].idTraitement").value(hasItem(DEFAULT_ID_TRAITEMENT.intValue())))
            .andExpect(jsonPath("$.[*].frais").value(hasItem(DEFAULT_FRAIS.intValue())));
    }

    @Test
    @Transactional
    public void getTraitement() throws Exception {
        // Initialize the database
        traitementRepository.saveAndFlush(traitement);

        // Get the traitement
        restTraitementMockMvc
            .perform(get("/api/traitements/{id}", traitement.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(traitement.getId().intValue()))
            .andExpect(jsonPath("$.idTraitement").value(DEFAULT_ID_TRAITEMENT.intValue()))
            .andExpect(jsonPath("$.frais").value(DEFAULT_FRAIS.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingTraitement() throws Exception {
        // Get the traitement
        restTraitementMockMvc.perform(get("/api/traitements/{id}", Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTraitement() throws Exception {
        // Initialize the database
        traitementRepository.saveAndFlush(traitement);

        int databaseSizeBeforeUpdate = traitementRepository.findAll().size();

        // Update the traitement
        Traitement updatedTraitement = traitementRepository.findById(traitement.getId()).get();
        // Disconnect from session so that the updates on updatedTraitement are not directly saved in db
        em.detach(updatedTraitement);
        updatedTraitement.idTraitement(UPDATED_ID_TRAITEMENT).frais(UPDATED_FRAIS);

        restTraitementMockMvc
            .perform(
                put("/api/traitements")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTraitement))
            )
            .andExpect(status().isOk());

        // Validate the Traitement in the database
        List<Traitement> traitementList = traitementRepository.findAll();
        assertThat(traitementList).hasSize(databaseSizeBeforeUpdate);
        Traitement testTraitement = traitementList.get(traitementList.size() - 1);
        assertThat(testTraitement.getIdTraitement()).isEqualTo(UPDATED_ID_TRAITEMENT);
        assertThat(testTraitement.getFrais()).isEqualTo(UPDATED_FRAIS);

        // Validate the Traitement in Elasticsearch
        verify(mockTraitementSearchRepository, times(1)).save(testTraitement);
    }

    @Test
    @Transactional
    public void updateNonExistingTraitement() throws Exception {
        int databaseSizeBeforeUpdate = traitementRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTraitementMockMvc
            .perform(put("/api/traitements").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(traitement)))
            .andExpect(status().isBadRequest());

        // Validate the Traitement in the database
        List<Traitement> traitementList = traitementRepository.findAll();
        assertThat(traitementList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Traitement in Elasticsearch
        verify(mockTraitementSearchRepository, times(0)).save(traitement);
    }

    @Test
    @Transactional
    public void deleteTraitement() throws Exception {
        // Initialize the database
        traitementRepository.saveAndFlush(traitement);

        int databaseSizeBeforeDelete = traitementRepository.findAll().size();

        // Delete the traitement
        restTraitementMockMvc
            .perform(delete("/api/traitements/{id}", traitement.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Traitement> traitementList = traitementRepository.findAll();
        assertThat(traitementList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Traitement in Elasticsearch
        verify(mockTraitementSearchRepository, times(1)).deleteById(traitement.getId());
    }

    @Test
    @Transactional
    public void searchTraitement() throws Exception {
        // Configure the mock search repository
        // Initialize the database
        traitementRepository.saveAndFlush(traitement);
        when(mockTraitementSearchRepository.search(queryStringQuery("id:" + traitement.getId())))
            .thenReturn(Collections.singletonList(traitement));

        // Search the traitement
        restTraitementMockMvc
            .perform(get("/api/_search/traitements?query=id:" + traitement.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(traitement.getId().intValue())))
            .andExpect(jsonPath("$.[*].idTraitement").value(hasItem(DEFAULT_ID_TRAITEMENT.intValue())))
            .andExpect(jsonPath("$.[*].frais").value(hasItem(DEFAULT_FRAIS.intValue())));
    }
}
