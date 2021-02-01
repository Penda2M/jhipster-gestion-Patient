package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.FieldType;

/**
 * A Service.
 */
@Entity
@Table(name = "service")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "service")
public class Service implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nomservice")
    private String nomservice;

    @OneToMany(mappedBy = "service")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Medecin> medecins = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = "services", allowSetters = true)
    private Administrateur administrateur;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomservice() {
        return nomservice;
    }

    public Service nomservice(String nomservice) {
        this.nomservice = nomservice;
        return this;
    }

    public void setNomservice(String nomservice) {
        this.nomservice = nomservice;
    }

    public Set<Medecin> getMedecins() {
        return medecins;
    }

    public Service medecins(Set<Medecin> medecins) {
        this.medecins = medecins;
        return this;
    }

    public Service addMedecin(Medecin medecin) {
        this.medecins.add(medecin);
        medecin.setService(this);
        return this;
    }

    public Service removeMedecin(Medecin medecin) {
        this.medecins.remove(medecin);
        medecin.setService(null);
        return this;
    }

    public void setMedecins(Set<Medecin> medecins) {
        this.medecins = medecins;
    }

    public Administrateur getAdministrateur() {
        return administrateur;
    }

    public Service administrateur(Administrateur administrateur) {
        this.administrateur = administrateur;
        return this;
    }

    public void setAdministrateur(Administrateur administrateur) {
        this.administrateur = administrateur;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Service)) {
            return false;
        }
        return id != null && id.equals(((Service) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Service{" +
            "id=" + getId() +
            ", nomservice='" + getNomservice() + "'" +
            "}";
    }
}
