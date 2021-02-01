package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.GestionPatientApp;
import com.mycompany.myapp.domain.Ordonnance;
import com.mycompany.myapp.repository.OrdonnanceRepository;
import com.mycompany.myapp.repository.search.OrdonnanceSearchRepository;
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
 * Integration tests for the {@link OrdonnanceResource} REST controller.
 */
@SpringBootTest(classes = GestionPatientApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class OrdonnanceResourceIT {
    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private OrdonnanceRepository ordonnanceRepository;

    /**
     * This repository is mocked in the com.mycompany.myapp.repository.search test package.
     *
     * @see com.mycompany.myapp.repository.search.OrdonnanceSearchRepositoryMockConfiguration
     */
    @Autowired
    private OrdonnanceSearchRepository mockOrdonnanceSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrdonnanceMockMvc;

    private Ordonnance ordonnance;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ordonnance createEntity(EntityManager em) {
        Ordonnance ordonnance = new Ordonnance().date(DEFAULT_DATE);
        return ordonnance;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ordonnance createUpdatedEntity(EntityManager em) {
        Ordonnance ordonnance = new Ordonnance().date(UPDATED_DATE);
        return ordonnance;
    }

    @BeforeEach
    public void initTest() {
        ordonnance = createEntity(em);
    }

    @Test
    @Transactional
    public void createOrdonnance() throws Exception {
        int databaseSizeBeforeCreate = ordonnanceRepository.findAll().size();
        // Create the Ordonnance
        restOrdonnanceMockMvc
            .perform(
                post("/api/ordonnances").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ordonnance))
            )
            .andExpect(status().isCreated());

        // Validate the Ordonnance in the database
        List<Ordonnance> ordonnanceList = ordonnanceRepository.findAll();
        assertThat(ordonnanceList).hasSize(databaseSizeBeforeCreate + 1);
        Ordonnance testOrdonnance = ordonnanceList.get(ordonnanceList.size() - 1);
        assertThat(testOrdonnance.getDate()).isEqualTo(DEFAULT_DATE);

        // Validate the Ordonnance in Elasticsearch
        verify(mockOrdonnanceSearchRepository, times(1)).save(testOrdonnance);
    }

    @Test
    @Transactional
    public void createOrdonnanceWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = ordonnanceRepository.findAll().size();

        // Create the Ordonnance with an existing ID
        ordonnance.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrdonnanceMockMvc
            .perform(
                post("/api/ordonnances").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ordonnance))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ordonnance in the database
        List<Ordonnance> ordonnanceList = ordonnanceRepository.findAll();
        assertThat(ordonnanceList).hasSize(databaseSizeBeforeCreate);

        // Validate the Ordonnance in Elasticsearch
        verify(mockOrdonnanceSearchRepository, times(0)).save(ordonnance);
    }

    @Test
    @Transactional
    public void getAllOrdonnances() throws Exception {
        // Initialize the database
        ordonnanceRepository.saveAndFlush(ordonnance);

        // Get all the ordonnanceList
        restOrdonnanceMockMvc
            .perform(get("/api/ordonnances?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ordonnance.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    public void getOrdonnance() throws Exception {
        // Initialize the database
        ordonnanceRepository.saveAndFlush(ordonnance);

        // Get the ordonnance
        restOrdonnanceMockMvc
            .perform(get("/api/ordonnances/{id}", ordonnance.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ordonnance.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingOrdonnance() throws Exception {
        // Get the ordonnance
        restOrdonnanceMockMvc.perform(get("/api/ordonnances/{id}", Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateOrdonnance() throws Exception {
        // Initialize the database
        ordonnanceRepository.saveAndFlush(ordonnance);

        int databaseSizeBeforeUpdate = ordonnanceRepository.findAll().size();

        // Update the ordonnance
        Ordonnance updatedOrdonnance = ordonnanceRepository.findById(ordonnance.getId()).get();
        // Disconnect from session so that the updates on updatedOrdonnance are not directly saved in db
        em.detach(updatedOrdonnance);
        updatedOrdonnance.date(UPDATED_DATE);

        restOrdonnanceMockMvc
            .perform(
                put("/api/ordonnances")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOrdonnance))
            )
            .andExpect(status().isOk());

        // Validate the Ordonnance in the database
        List<Ordonnance> ordonnanceList = ordonnanceRepository.findAll();
        assertThat(ordonnanceList).hasSize(databaseSizeBeforeUpdate);
        Ordonnance testOrdonnance = ordonnanceList.get(ordonnanceList.size() - 1);
        assertThat(testOrdonnance.getDate()).isEqualTo(UPDATED_DATE);

        // Validate the Ordonnance in Elasticsearch
        verify(mockOrdonnanceSearchRepository, times(1)).save(testOrdonnance);
    }

    @Test
    @Transactional
    public void updateNonExistingOrdonnance() throws Exception {
        int databaseSizeBeforeUpdate = ordonnanceRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrdonnanceMockMvc
            .perform(put("/api/ordonnances").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ordonnance)))
            .andExpect(status().isBadRequest());

        // Validate the Ordonnance in the database
        List<Ordonnance> ordonnanceList = ordonnanceRepository.findAll();
        assertThat(ordonnanceList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Ordonnance in Elasticsearch
        verify(mockOrdonnanceSearchRepository, times(0)).save(ordonnance);
    }

    @Test
    @Transactional
    public void deleteOrdonnance() throws Exception {
        // Initialize the database
        ordonnanceRepository.saveAndFlush(ordonnance);

        int databaseSizeBeforeDelete = ordonnanceRepository.findAll().size();

        // Delete the ordonnance
        restOrdonnanceMockMvc
            .perform(delete("/api/ordonnances/{id}", ordonnance.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Ordonnance> ordonnanceList = ordonnanceRepository.findAll();
        assertThat(ordonnanceList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Ordonnance in Elasticsearch
        verify(mockOrdonnanceSearchRepository, times(1)).deleteById(ordonnance.getId());
    }

    @Test
    @Transactional
    public void searchOrdonnance() throws Exception {
        // Configure the mock search repository
        // Initialize the database
        ordonnanceRepository.saveAndFlush(ordonnance);
        when(mockOrdonnanceSearchRepository.search(queryStringQuery("id:" + ordonnance.getId())))
            .thenReturn(Collections.singletonList(ordonnance));

        // Search the ordonnance
        restOrdonnanceMockMvc
            .perform(get("/api/_search/ordonnances?query=id:" + ordonnance.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ordonnance.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }
}
