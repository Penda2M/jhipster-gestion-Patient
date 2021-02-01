package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.FieldType;

/**
 * A Traitement.
 */
@Entity
@Table(name = "traitement")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "traitement")
public class Traitement implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_traitement")
    private Long idTraitement;

    @Column(name = "frais")
    private Long frais;

    @ManyToOne
    @JsonIgnoreProperties(value = "traitements", allowSetters = true)
    private Ordonnance ordonance;

    @ManyToOne
    @JsonIgnoreProperties(value = "traitements", allowSetters = true)
    private Medicament medicament;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdTraitement() {
        return idTraitement;
    }

    public Traitement idTraitement(Long idTraitement) {
        this.idTraitement = idTraitement;
        return this;
    }

    public void setIdTraitement(Long idTraitement) {
        this.idTraitement = idTraitement;
    }

    public Long getFrais() {
        return frais;
    }

    public Traitement frais(Long frais) {
        this.frais = frais;
        return this;
    }

    public void setFrais(Long frais) {
        this.frais = frais;
    }

    public Ordonnance getOrdonance() {
        return ordonance;
    }

    public Traitement ordonance(Ordonnance ordonnance) {
        this.ordonance = ordonnance;
        return this;
    }

    public void setOrdonance(Ordonnance ordonnance) {
        this.ordonance = ordonnance;
    }

    public Medicament getMedicament() {
        return medicament;
    }

    public Traitement medicament(Medicament medicament) {
        this.medicament = medicament;
        return this;
    }

    public void setMedicament(Medicament medicament) {
        this.medicament = medicament;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Traitement)) {
            return false;
        }
        return id != null && id.equals(((Traitement) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Traitement{" +
            "id=" + getId() +
            ", idTraitement=" + getIdTraitement() +
            ", frais=" + getFrais() +
            "}";
    }
}
