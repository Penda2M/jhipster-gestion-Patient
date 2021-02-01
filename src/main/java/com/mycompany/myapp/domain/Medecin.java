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
 * A Medecin.
 */
@Entity
@Table(name = "medecin")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "medecin")
public class Medecin implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "matricule")
    private String matricule;

    @Column(name = "nom")
    private String nom;

    @Column(name = "prenom")
    private String prenom;

    @Column(name = "grademedical")
    private String grademedical;

    @Column(name = "telephone")
    private String telephone;

    @Column(name = "password")
    private String password;

    @OneToMany(mappedBy = "medecin")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Ordonnance> ordonances = new HashSet<>();

    @OneToMany(mappedBy = "medecin")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<RendezVous> rendezvous = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = "medecins", allowSetters = true)
    private Service service;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMatricule() {
        return matricule;
    }

    public Medecin matricule(String matricule) {
        this.matricule = matricule;
        return this;
    }

    public void setMatricule(String matricule) {
        this.matricule = matricule;
    }

    public String getNom() {
        return nom;
    }

    public Medecin nom(String nom) {
        this.nom = nom;
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public Medecin prenom(String prenom) {
        this.prenom = prenom;
        return this;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getGrademedical() {
        return grademedical;
    }

    public Medecin grademedical(String grademedical) {
        this.grademedical = grademedical;
        return this;
    }

    public void setGrademedical(String grademedical) {
        this.grademedical = grademedical;
    }

    public String getTelephone() {
        return telephone;
    }

    public Medecin telephone(String telephone) {
        this.telephone = telephone;
        return this;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getPassword() {
        return password;
    }

    public Medecin password(String password) {
        this.password = password;
        return this;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<Ordonnance> getOrdonances() {
        return ordonances;
    }

    public Medecin ordonances(Set<Ordonnance> ordonnances) {
        this.ordonances = ordonnances;
        return this;
    }

    public Medecin addOrdonance(Ordonnance ordonnance) {
        this.ordonances.add(ordonnance);
        ordonnance.setMedecin(this);
        return this;
    }

    public Medecin removeOrdonance(Ordonnance ordonnance) {
        this.ordonances.remove(ordonnance);
        ordonnance.setMedecin(null);
        return this;
    }

    public void setOrdonances(Set<Ordonnance> ordonnances) {
        this.ordonances = ordonnances;
    }

    public Set<RendezVous> getRendezvous() {
        return rendezvous;
    }

    public Medecin rendezvous(Set<RendezVous> rendezVous) {
        this.rendezvous = rendezVous;
        return this;
    }

    public Medecin addRendezvous(RendezVous rendezVous) {
        this.rendezvous.add(rendezVous);
        rendezVous.setMedecin(this);
        return this;
    }

    public Medecin removeRendezvous(RendezVous rendezVous) {
        this.rendezvous.remove(rendezVous);
        rendezVous.setMedecin(null);
        return this;
    }

    public void setRendezvous(Set<RendezVous> rendezVous) {
        this.rendezvous = rendezVous;
    }

    public Service getService() {
        return service;
    }

    public Medecin service(Service service) {
        this.service = service;
        return this;
    }

    public void setService(Service service) {
        this.service = service;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Medecin)) {
            return false;
        }
        return id != null && id.equals(((Medecin) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Medecin{" +
            "id=" + getId() +
            ", matricule='" + getMatricule() + "'" +
            ", nom='" + getNom() + "'" +
            ", prenom='" + getPrenom() + "'" +
            ", grademedical='" + getGrademedical() + "'" +
            ", telephone='" + getTelephone() + "'" +
            ", password='" + getPassword() + "'" +
            "}";
    }
}
