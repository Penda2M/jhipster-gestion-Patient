package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.FieldType;

/**
 * A Ordonnance.
 */
@Entity
@Table(name = "ordonnance")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "ordonnance")
public class Ordonnance implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date")
    private Instant date;

    @OneToMany(mappedBy = "ordonance")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Traitement> traitements = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = "ordonances", allowSetters = true)
    private Medecin medecin;

    @ManyToOne
    @JsonIgnoreProperties(value = "ordonances", allowSetters = true)
    private Patient patient;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getDate() {
        return date;
    }

    public Ordonnance date(Instant date) {
        this.date = date;
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public Set<Traitement> getTraitements() {
        return traitements;
    }

    public Ordonnance traitements(Set<Traitement> traitements) {
        this.traitements = traitements;
        return this;
    }

    public Ordonnance addTraitement(Traitement traitement) {
        this.traitements.add(traitement);
        traitement.setOrdonance(this);
        return this;
    }

    public Ordonnance removeTraitement(Traitement traitement) {
        this.traitements.remove(traitement);
        traitement.setOrdonance(null);
        return this;
    }

    public void setTraitements(Set<Traitement> traitements) {
        this.traitements = traitements;
    }

    public Medecin getMedecin() {
        return medecin;
    }

    public Ordonnance medecin(Medecin medecin) {
        this.medecin = medecin;
        return this;
    }

    public void setMedecin(Medecin medecin) {
        this.medecin = medecin;
    }

    public Patient getPatient() {
        return patient;
    }

    public Ordonnance patient(Patient patient) {
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
        if (!(o instanceof Ordonnance)) {
            return false;
        }
        return id != null && id.equals(((Ordonnance) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Ordonnance{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            "}";
    }
}
