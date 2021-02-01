package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.GestionPatientApp;
import com.mycompany.myapp.domain.RendezVous;
import com.mycompany.myapp.repository.RendezVousRepository;
import com.mycompany.myapp.repository.search.RendezVousSearchRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link RendezVousResource} REST controller.
 */
@SpringBootTest(classes = GestionPatientApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class RendezVousResourceIT {
    private static final Long DEFAULT_ID_RV = 1L;
    private static final Long UPDATED_ID_RV = 2L;

    private static final Instant DEFAULT_DATE_RV = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_RV = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private RendezVousRepository rendezVousRepository;

    /**
     * This repository is mocked in the com.mycompany.myapp.repository.search test package.
     *
     * @see com.mycompany.myapp.repository.search.RendezVousSearchRepositoryMockConfiguration
     */
    @Autowired
    private RendezVousSearchRepository mockRendezVousSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRendezVousMockMvc;

    private RendezVous rendezVous;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RendezVous createEntity(EntityManager em) {
        RendezVous rendezVous = new RendezVous().idRv(DEFAULT_ID_RV).dateRv(DEFAULT_DATE_RV);
        return rendezVous;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RendezVous createUpdatedEntity(EntityManager em) {
        RendezVous rendezVous = new RendezVous().idRv(UPDATED_ID_RV).dateRv(UPDATED_DATE_RV);
        return rendezVous;
    }

    @BeforeEach
    public void initTest() {
        rendezVous = createEntity(em);
    }

    @Test
    @Transactional
    public void createRendezVous() throws Exception {
        int databaseSizeBeforeCreate = rendezVousRepository.findAll().size();
        // Create the RendezVous
        restRendezVousMockMvc
            .perform(
                post("/api/rendez-vous").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rendezVous))
            )
            .andExpect(status().isCreated());

        // Validate the RendezVous in the database
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeCreate + 1);
        RendezVous testRendezVous = rendezVousList.get(rendezVousList.size() - 1);
        assertThat(testRendezVous.getIdRv()).isEqualTo(DEFAULT_ID_RV);
        assertThat(testRendezVous.getDateRv()).isEqualTo(DEFAULT_DATE_RV);

        // Validate the RendezVous in Elasticsearch
        verify(mockRendezVousSearchRepository, times(1)).save(testRendezVous);
    }

    @Test
    @Transactional
    public void createRendezVousWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = rendezVousRepository.findAll().size();

        // Create the RendezVous with an existing ID
        rendezVous.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restRendezVousMockMvc
            .perform(
                post("/api/rendez-vous").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rendezVous))
            )
            .andExpect(status().isBadRequest());

        // Validate the RendezVous in the database
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeCreate);

        // Validate the RendezVous in Elasticsearch
        verify(mockRendezVousSearchRepository, times(0)).save(rendezVous);
    }

    @Test
    @Transactional
    public void getAllRendezVous() throws Exception {
        // Initialize the database
        rendezVousRepository.saveAndFlush(rendezVous);

        // Get all the rendezVousList
        restRendezVousMockMvc
            .perform(get("/api/rendez-vous?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(rendezVous.getId().intValue())))
            .andExpect(jsonPath("$.[*].idRv").value(hasItem(DEFAULT_ID_RV.intValue())))
            .andExpect(jsonPath("$.[*].dateRv").value(hasItem(DEFAULT_DATE_RV.toString())));
    }

    @Test
    @Transactional
    public void getRendezVous() throws Exception {
        // Initialize the database
        rendezVousRepository.saveAndFlush(rendezVous);

        // Get the rendezVous
        restRendezVousMockMvc
            .perform(get("/api/rendez-vous/{id}", rendezVous.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(rendezVous.getId().intValue()))
            .andExpect(jsonPath("$.idRv").value(DEFAULT_ID_RV.intValue()))
            .andExpect(jsonPath("$.dateRv").value(DEFAULT_DATE_RV.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingRendezVous() throws Exception {
        // Get the rendezVous
        restRendezVousMockMvc.perform(get("/api/rendez-vous/{id}", Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateRendezVous() throws Exception {
        // Initialize the database
        rendezVousRepository.saveAndFlush(rendezVous);

        int databaseSizeBeforeUpdate = rendezVousRepository.findAll().size();

        // Update the rendezVous
        RendezVous updatedRendezVous = rendezVousRepository.findById(rendezVous.getId()).get();
        // Disconnect from session so that the updates on updatedRendezVous are not directly saved in db
        em.detach(updatedRendezVous);
        updatedRendezVous.idRv(UPDATED_ID_RV).dateRv(UPDATED_DATE_RV);

        restRendezVousMockMvc
            .perform(
                put("/api/rendez-vous")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRendezVous))
            )
            .andExpect(status().isOk());

        // Validate the RendezVous in the database
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeUpdate);
        RendezVous testRendezVous = rendezVousList.get(rendezVousList.size() - 1);
        assertThat(testRendezVous.getIdRv()).isEqualTo(UPDATED_ID_RV);
        assertThat(testRendezVous.getDateRv()).isEqualTo(UPDATED_DATE_RV);

        // Validate the RendezVous in Elasticsearch
        verify(mockRendezVousSearchRepository, times(1)).save(testRendezVous);
    }

    @Test
    @Transactional
    public void updateNonExistingRendezVous() throws Exception {
        int databaseSizeBeforeUpdate = rendezVousRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRendezVousMockMvc
            .perform(put("/api/rendez-vous").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rendezVous)))
            .andExpect(status().isBadRequest());

        // Validate the RendezVous in the database
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeUpdate);

        // Validate the RendezVous in Elasticsearch
        verify(mockRendezVousSearchRepository, times(0)).save(rendezVous);
    }

    @Test
    @Transactional
    public void deleteRendezVous() throws Exception {
        // Initialize the database
        rendezVousRepository.saveAndFlush(rendezVous);

        int databaseSizeBeforeDelete = rendezVousRepository.findAll().size();

        // Delete the rendezVous
        restRendezVousMockMvc
            .perform(delete("/api/rendez-vous/{id}", rendezVous.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the RendezVous in Elasticsearch
        verify(mockRendezVousSearchRepository, times(1)).deleteById(rendezVous.getId());
    }

    @Test
    @Transactional
    public void searchRendezVous() throws Exception {
        // Configure the mock search repository
        // Initialize the database
        rendezVousRepository.saveAndFlush(rendezVous);
        when(mockRendezVousSearchRepository.search(queryStringQuery("id:" + rendezVous.getId())))
            .thenReturn(Collections.singletonList(rendezVous));

        // Search the rendezVous
        restRendezVousMockMvc
            .perform(get("/api/_search/rendez-vous?query=id:" + rendezVous.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(rendezVous.getId().intValue())))
            .andExpect(jsonPath("$.[*].idRv").value(hasItem(DEFAULT_ID_RV.intValue())))
            .andExpect(jsonPath("$.[*].dateRv").value(hasItem(DEFAULT_DATE_RV.toString())));
    }
}
