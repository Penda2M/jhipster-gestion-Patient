package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.FieldType;

/**
 * A RendezVous.
 */
@Entity
@Table(name = "rendez_vous")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "rendezvous")
public class RendezVous implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_rv")
    private Long idRv;

    @Column(name = "date_rv")
    private Instant dateRv;

    @ManyToOne
    @JsonIgnoreProperties(value = "rendezvous", allowSetters = true)
    private Medecin medecin;

    @ManyToOne
    @JsonIgnoreProperties(value = "rendezvous", allowSetters = true)
    private Patient patient;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdRv() {
        return idRv;
    }

    public RendezVous idRv(Long idRv) {
        this.idRv = idRv;
        return this;
    }

    public void setIdRv(Long idRv) {
        this.idRv = idRv;
    }

    public Instant getDateRv() {
        return dateRv;
    }

    public RendezVous dateRv(Instant dateRv) {
        this.dateRv = dateRv;
        return this;
    }

    public void setDateRv(Instant dateRv) {
        this.dateRv = dateRv;
    }

    public Medecin getMedecin() {
        return medecin;
    }

    public RendezVous medecin(Medecin medecin) {
        this.medecin = medecin;
        return this;
    }

    public void setMedecin(Medecin medecin) {
        this.medecin = medecin;
    }

    public Patient getPatient() {
        return patient;
    }

    public RendezVous patient(Patient patient) {
        this.patient = patient;
        return this;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RendezVous)) {
            return false;
        }
        return id != null && id.equals(((RendezVous) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RendezVous{" +
            "id=" + getId() +
            ", idRv=" + getIdRv() +
            ", dateRv='" + getDateRv() + "'" +
            "}";
    }
}
