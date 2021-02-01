package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.GestionPatientApp;
import com.mycompany.myapp.domain.Administrateur;
import com.mycompany.myapp.repository.AdministrateurRepository;
import com.mycompany.myapp.repository.search.AdministrateurSearchRepository;
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
 * Integration tests for the {@link AdministrateurResource} REST controller.
 */
@SpringBootTest(classes = GestionPatientApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class AdministrateurResourceIT {
    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_PRENOM = "AAAAAAAAAA";
    private static final String UPDATED_PRENOM = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_PASSWORD = "AAAAAAAAAA";
    private static final String UPDATED_PASSWORD = "BBBBBBBBBB";

    @Autowired
    private AdministrateurRepository administrateurRepository;

    /**
     * This repository is mocked in the com.mycompany.myapp.repository.search test package.
     *
     * @see com.mycompany.myapp.repository.search.AdministrateurSearchRepositoryMockConfiguration
     */
    @Autowired
    private AdministrateurSearchRepository mockAdministrateurSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAdministrateurMockMvc;

    private Administrateur administrateur;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Administrateur createEntity(EntityManager em) {
        Administrateur administrateur = new Administrateur()
            .nom(DEFAULT_NOM)
            .prenom(DEFAULT_PRENOM)
            .email(DEFAULT_EMAIL)
            .password(DEFAULT_PASSWORD);
        return administrateur;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Administrateur createUpdatedEntity(EntityManager em) {
        Administrateur administrateur = new Administrateur()
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .email(UPDATED_EMAIL)
            .password(UPDATED_PASSWORD);
        return administrateur;
    }

    @BeforeEach
    public void initTest() {
        administrateur = createEntity(em);
    }

    @Test
    @Transactional
    public void createAdministrateur() throws Exception {
        int databaseSizeBeforeCreate = administrateurRepository.findAll().size();
        // Create the Administrateur
        restAdministrateurMockMvc
            .perform(
                post("/api/administrateurs")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(administrateur))
            )
            .andExpect(status().isCreated());

        // Validate the Administrateur in the database
        List<Administrateur> administrateurList = administrateurRepository.findAll();
        assertThat(administrateurList).hasSize(databaseSizeBeforeCreate + 1);
        Administrateur testAdministrateur = administrateurList.get(administrateurList.size() - 1);
        assertThat(testAdministrateur.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testAdministrateur.getPrenom()).isEqualTo(DEFAULT_PRENOM);
        assertThat(testAdministrateur.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testAdministrateur.getPassword()).isEqualTo(DEFAULT_PASSWORD);

        // Validate the Administrateur in Elasticsearch
        verify(mockAdministrateurSearchRepository, times(1)).save(testAdministrateur);
    }

    @Test
    @Transactional
    public void createAdministrateurWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = administrateurRepository.findAll().size();

        // Create the Administrateur with an existing ID
        administrateur.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restAdministrateurMockMvc
            .perform(
                post("/api/administrateurs")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(administrateur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Administrateur in the database
        List<Administrateur> administrateurList = administrateurRepository.findAll();
        assertThat(administrateurList).hasSize(databaseSizeBeforeCreate);

        // Validate the Administrateur in Elasticsearch
        verify(mockAdministrateurSearchRepository, times(0)).save(administrateur);
    }

    @Test
    @Transactional
    public void getAllAdministrateurs() throws Exception {
        // Initialize the database
        administrateurRepository.saveAndFlush(administrateur);

        // Get all the administrateurList
        restAdministrateurMockMvc
            .perform(get("/api/administrateurs?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(administrateur.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].prenom").value(hasItem(DEFAULT_PRENOM)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].password").value(hasItem(DEFAULT_PASSWORD)));
    }

    @Test
    @Transactional
    public void getAdministrateur() throws Exception {
        // Initialize the database
        administrateurRepository.saveAndFlush(administrateur);

        // Get the administrateur
        restAdministrateurMockMvc
            .perform(get("/api/administrateurs/{id}", administrateur.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(administrateur.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.prenom").value(DEFAULT_PRENOM))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.password").value(DEFAULT_PASSWORD));
    }

    @Test
    @Transactional
    public void getNonExistingAdministrateur() throws Exception {
        // Get the administrateur
        restAdministrateurMockMvc.perform(get("/api/administrateurs/{id}", Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAdministrateur() throws Exception {
        // Initialize the database
        administrateurRepository.saveAndFlush(administrateur);

        int databaseSizeBeforeUpdate = administrateurRepository.findAll().size();

        // Update the administrateur
        Administrateur updatedAdministrateur = administrateurRepository.findById(administrateur.getId()).get();
        // Disconnect from session so that the updates on updatedAdministrateur are not directly saved in db
        em.detach(updatedAdministrateur);
        updatedAdministrateur.nom(UPDATED_NOM).prenom(UPDATED_PRENOM).email(UPDATED_EMAIL).password(UPDATED_PASSWORD);

        restAdministrateurMockMvc
            .perform(
                put("/api/administrateurs")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAdministrateur))
            )
            .andExpect(status().isOk());

        // Validate the Administrateur in the database
        List<Administrateur> administrateurList = administrateurRepository.findAll();
        assertThat(administrateurList).hasSize(databaseSizeBeforeUpdate);
        Administrateur testAdministrateur = administrateurList.get(administrateurList.size() - 1);
        assertThat(testAdministrateur.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testAdministrateur.getPrenom()).isEqualTo(UPDATED_PRENOM);
        assertThat(testAdministrateur.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testAdministrateur.getPassword()).isEqualTo(UPDATED_PASSWORD);

        // Validate the Administrateur in Elasticsearch
        verify(mockAdministrateurSearchRepository, times(1)).save(testAdministrateur);
    }

    @Test
    @Transactional
    public void updateNonExistingAdministrateur() throws Exception {
        int databaseSizeBeforeUpdate = administrateurRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdministrateurMockMvc
            .perform(
                put("/api/administrateurs")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(administrateur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Administrateur in the database
        List<Administrateur> administrateurList = administrateurRepository.findAll();
        assertThat(administrateurList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Administrateur in Elasticsearch
        verify(mockAdministrateurSearchRepository, times(0)).save(administrateur);
    }

    @Test
    @Transactional
    public void deleteAdministrateur() throws Exception {
        // Initialize the database
        administrateurRepository.saveAndFlush(administrateur);

        int databaseSizeBeforeDelete = administrateurRepository.findAll().size();

        // Delete the administrateur
        restAdministrateurMockMvc
            .perform(delete("/api/administrateurs/{id}", administrateur.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Administrateur> administrateurList = administrateurRepository.findAll();
        assertThat(administrateurList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Administrateur in Elasticsearch
        verify(mockAdministrateurSearchRepository, times(1)).deleteById(administrateur.getId());
    }

    @Test
    @Transactional
    public void searchAdministrateur() throws Exception {
        // Configure the mock search repository
        // Initialize the database
        administrateurRepository.saveAndFlush(administrateur);
        when(mockAdministrateurSearchRepository.search(queryStringQuery("id:" + administrateur.getId())))
            .thenReturn(Collections.singletonList(administrateur));

        // Search the administrateur
        restAdministrateurMockMvc
            .perform(get("/api/_search/administrateurs?query=id:" + administrateur.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(administrateur.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].prenom").value(hasItem(DEFAULT_PRENOM)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].password").value(hasItem(DEFAULT_PASSWORD)));
    }
}
