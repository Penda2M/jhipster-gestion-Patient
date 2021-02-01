package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.GestionPatientApp;
import com.mycompany.myapp.domain.Patient;
import com.mycompany.myapp.domain.enumeration.Genre;
import com.mycompany.myapp.repository.PatientRepository;
import com.mycompany.myapp.repository.search.PatientSearchRepository;
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
 * Integration tests for the {@link PatientResource} REST controller.
 */
@SpringBootTest(classes = GestionPatientApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class PatientResourceIT {
    private static final Long DEFAULT_NOMERO = 1L;
    private static final Long UPDATED_NOMERO = 2L;

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_PRENOM = "AAAAAAAAAA";
    private static final String UPDATED_PRENOM = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATENAISSANCE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATENAISSANCE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_LIEUNAISSANCE = "AAAAAAAAAA";
    private static final String UPDATED_LIEUNAISSANCE = "BBBBBBBBBB";

    private static final String DEFAULT_ADRESSE = "AAAAAAAAAA";
    private static final String UPDATED_ADRESSE = "BBBBBBBBBB";

    private static final Genre DEFAULT_GENRE = Genre.HOMME;
    private static final Genre UPDATED_GENRE = Genre.FEMME;

    private static final String DEFAULT_TELEPHONE = "AAAAAAAAAA";
    private static final String UPDATED_TELEPHONE = "BBBBBBBBBB";

    private static final String DEFAULT_CNI = "AAAAAAAAAA";
    private static final String UPDATED_CNI = "BBBBBBBBBB";

    private static final String DEFAULT_PASSWORD = "AAAAAAAAAA";
    private static final String UPDATED_PASSWORD = "BBBBBBBBBB";

    @Autowired
    private PatientRepository patientRepository;

    /**
     * This repository is mocked in the com.mycompany.myapp.repository.search test package.
     *
     * @see com.mycompany.myapp.repository.search.PatientSearchRepositoryMockConfiguration
     */
    @Autowired
    private PatientSearchRepository mockPatientSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPatientMockMvc;

    private Patient patient;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Patient createEntity(EntityManager em) {
        Patient patient = new Patient()
            .nomero(DEFAULT_NOMERO)
            .nom(DEFAULT_NOM)
            .prenom(DEFAULT_PRENOM)
            .datenaissance(DEFAULT_DATENAISSANCE)
            .lieunaissance(DEFAULT_LIEUNAISSANCE)
            .adresse(DEFAULT_ADRESSE)
            .genre(DEFAULT_GENRE)
            .telephone(DEFAULT_TELEPHONE)
            .cni(DEFAULT_CNI)
            .password(DEFAULT_PASSWORD);
        return patient;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Patient createUpdatedEntity(EntityManager em) {
        Patient patient = new Patient()
            .nomero(UPDATED_NOMERO)
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .datenaissance(UPDATED_DATENAISSANCE)
            .lieunaissance(UPDATED_LIEUNAISSANCE)
            .adresse(UPDATED_ADRESSE)
            .genre(UPDATED_GENRE)
            .telephone(UPDATED_TELEPHONE)
            .cni(UPDATED_CNI)
            .password(UPDATED_PASSWORD);
        return patient;
    }

    @BeforeEach
    public void initTest() {
        patient = createEntity(em);
    }

    @Test
    @Transactional
    public void createPatient() throws Exception {
        int databaseSizeBeforeCreate = patientRepository.findAll().size();
        // Create the Patient
        restPatientMockMvc
            .perform(post("/api/patients").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(patient)))
            .andExpect(status().isCreated());

        // Validate the Patient in the database
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeCreate + 1);
        Patient testPatient = patientList.get(patientList.size() - 1);
        assertThat(testPatient.getNomero()).isEqualTo(DEFAULT_NOMERO);
        assertThat(testPatient.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testPatient.getPrenom()).isEqualTo(DEFAULT_PRENOM);
        assertThat(testPatient.getDatenaissance()).isEqualTo(DEFAULT_DATENAISSANCE);
        assertThat(testPatient.getLieunaissance()).isEqualTo(DEFAULT_LIEUNAISSANCE);
        assertThat(testPatient.getAdresse()).isEqualTo(DEFAULT_ADRESSE);
        assertThat(testPatient.getGenre()).isEqualTo(DEFAULT_GENRE);
        assertThat(testPatient.getTelephone()).isEqualTo(DEFAULT_TELEPHONE);
        assertThat(testPatient.getCni()).isEqualTo(DEFAULT_CNI);
        assertThat(testPatient.getPassword()).isEqualTo(DEFAULT_PASSWORD);

        // Validate the Patient in Elasticsearch
        verify(mockPatientSearchRepository, times(1)).save(testPatient);
    }

    @Test
    @Transactional
    public void createPatientWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = patientRepository.findAll().size();

        // Create the Patient with an existing ID
        patient.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPatientMockMvc
            .perform(post("/api/patients").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(patient)))
            .andExpect(status().isBadRequest());

        // Validate the Patient in the database
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeCreate);

        // Validate the Patient in Elasticsearch
        verify(mockPatientSearchRepository, times(0)).save(patient);
    }

    @Test
    @Transactional
    public void getAllPatients() throws Exception {
        // Initialize the database
        patientRepository.saveAndFlush(patient);

        // Get all the patientList
        restPatientMockMvc
            .perform(get("/api/patients?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(patient.getId().intValue())))
            .andExpect(jsonPath("$.[*].nomero").value(hasItem(DEFAULT_NOMERO.intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].prenom").value(hasItem(DEFAULT_PRENOM)))
            .andExpect(jsonPath("$.[*].datenaissance").value(hasItem(DEFAULT_DATENAISSANCE.toString())))
            .andExpect(jsonPath("$.[*].lieunaissance").value(hasItem(DEFAULT_LIEUNAISSANCE)))
            .andExpect(jsonPath("$.[*].adresse").value(hasItem(DEFAULT_ADRESSE)))
            .andExpect(jsonPath("$.[*].genre").value(hasItem(DEFAULT_GENRE.toString())))
            .andExpect(jsonPath("$.[*].telephone").value(hasItem(DEFAULT_TELEPHONE)))
            .andExpect(jsonPath("$.[*].cni").value(hasItem(DEFAULT_CNI)))
            .andExpect(jsonPath("$.[*].password").value(hasItem(DEFAULT_PASSWORD)));
    }

    @Test
    @Transactional
    public void getPatient() throws Exception {
        // Initialize the database
        patientRepository.saveAndFlush(patient);

        // Get the patient
        restPatientMockMvc
            .perform(get("/api/patients/{id}", patient.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(patient.getId().intValue()))
            .andExpect(jsonPath("$.nomero").value(DEFAULT_NOMERO.intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.prenom").value(DEFAULT_PRENOM))
            .andExpect(jsonPath("$.datenaissance").value(DEFAULT_DATENAISSANCE.toString()))
            .andExpect(jsonPath("$.lieunaissance").value(DEFAULT_LIEUNAISSANCE))
            .andExpect(jsonPath("$.adresse").value(DEFAULT_ADRESSE))
            .andExpect(jsonPath("$.genre").value(DEFAULT_GENRE.toString()))
            .andExpect(jsonPath("$.telephone").value(DEFAULT_TELEPHONE))
            .andExpect(jsonPath("$.cni").value(DEFAULT_CNI))
            .andExpect(jsonPath("$.password").value(DEFAULT_PASSWORD));
    }

    @Test
    @Transactional
    public void getNonExistingPatient() throws Exception {
        // Get the patient
        restPatientMockMvc.perform(get("/api/patients/{id}", Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePatient() throws Exception {
        // Initialize the database
        patientRepository.saveAndFlush(patient);

        int databaseSizeBeforeUpdate = patientRepository.findAll().size();

        // Update the patient
        Patient updatedPatient = patientRepository.findById(patient.getId()).get();
        // Disconnect from session so that the updates on updatedPatient are not directly saved in db
        em.detach(updatedPatient);
        updatedPatient
            .nomero(UPDATED_NOMERO)
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .datenaissance(UPDATED_DATENAISSANCE)
            .lieunaissance(UPDATED_LIEUNAISSANCE)
            .adresse(UPDATED_ADRESSE)
            .genre(UPDATED_GENRE)
            .telephone(UPDATED_TELEPHONE)
            .cni(UPDATED_CNI)
            .password(UPDATED_PASSWORD);

        restPatientMockMvc
            .perform(
                put("/api/patients").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(updatedPatient))
            )
            .andExpect(status().isOk());

        // Validate the Patient in the database
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeUpdate);
        Patient testPatient = patientList.get(patientList.size() - 1);
        assertThat(testPatient.getNomero()).isEqualTo(UPDATED_NOMERO);
        assertThat(testPatient.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testPatient.getPrenom()).isEqualTo(UPDATED_PRENOM);
        assertThat(testPatient.getDatenaissance()).isEqualTo(UPDATED_DATENAISSANCE);
        assertThat(testPatient.getLieunaissance()).isEqualTo(UPDATED_LIEUNAISSANCE);
        assertThat(testPatient.getAdresse()).isEqualTo(UPDATED_ADRESSE);
        assertThat(testPatient.getGenre()).isEqualTo(UPDATED_GENRE);
        assertThat(testPatient.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
        assertThat(testPatient.getCni()).isEqualTo(UPDATED_CNI);
        assertThat(testPatient.getPassword()).isEqualTo(UPDATED_PASSWORD);

        // Validate the Patient in Elasticsearch
        verify(mockPatientSearchRepository, times(1)).save(testPatient);
    }

    @Test
    @Transactional
    public void updateNonExistingPatient() throws Exception {
        int databaseSizeBeforeUpdate = patientRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPatientMockMvc
            .perform(put("/api/patients").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(patient)))
            .andExpect(status().isBadRequest());

        // Validate the Patient in the database
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Patient in Elasticsearch
        verify(mockPatientSearchRepository, times(0)).save(patient);
    }

    @Test
    @Transactional
    public void deletePatient() throws Exception {
        // Initialize the database
        patientRepository.saveAndFlush(patient);

        int databaseSizeBeforeDelete = patientRepository.findAll().size();

        // Delete the patient
        restPatientMockMvc
            .perform(delete("/api/patients/{id}", patient.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Patient in Elasticsearch
        verify(mockPatientSearchRepository, times(1)).deleteById(patient.getId());
    }

    @Test
    @Transactional
    public void searchPatient() throws Exception {
        // Configure the mock search repository
        // Initialize the database
        patientRepository.saveAndFlush(patient);
        when(mockPatientSearchRepository.search(queryStringQuery("id:" + patient.getId()))).thenReturn(Collections.singletonList(patient));

        // Search the patient
        restPatientMockMvc
            .perform(get("/api/_search/patients?query=id:" + patient.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(patient.getId().intValue())))
            .andExpect(jsonPath("$.[*].nomero").value(hasItem(DEFAULT_NOMERO.intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].prenom").value(hasItem(DEFAULT_PRENOM)))
            .andExpect(jsonPath("$.[*].datenaissance").value(hasItem(DEFAULT_DATENAISSANCE.toString())))
            .andExpect(jsonPath("$.[*].lieunaissance").value(hasItem(DEFAULT_LIEUNAISSANCE)))
            .andExpect(jsonPath("$.[*].adresse").value(hasItem(DEFAULT_ADRESSE)))
            .andExpect(jsonPath("$.[*].genre").value(hasItem(DEFAULT_GENRE.toString())))
            .andExpect(jsonPath("$.[*].telephone").value(hasItem(DEFAULT_TELEPHONE)))
            .andExpect(jsonPath("$.[*].cni").value(hasItem(DEFAULT_CNI)))
            .andExpect(jsonPath("$.[*].password").value(hasItem(DEFAULT_PASSWORD)));
    }
}
