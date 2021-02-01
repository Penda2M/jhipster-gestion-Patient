package com.mycompany.myapp.domain;

import com.mycompany.myapp.domain.enumeration.Genre;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.FieldType;

/**
 * A Patient.
 */
@Entity
@Table(name = "patient")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "patient")
public class Patient implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nomero")
    private Long nomero;

    @Column(name = "nom")
    private String nom;

    @Column(name = "prenom")
    private String prenom;

    @Column(name = "datenaissance")
    private Instant datenaissance;

    @Column(name = "lieunaissance")
    private String lieunaissance;

    @Column(name = "adresse")
    private String adresse;

    @Enumerated(EnumType.STRING)
    @Column(name = "genre")
    private Genre genre;

    @Column(name = "telephone")
    private String telephone;

    @Column(name = "cni")
    private String cni;

    @Column(name = "password")
    private String password;

    @OneToMany(mappedBy = "patient")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Ordonnance> ordonances = new HashSet<>();

    @OneToMany(mappedBy = "patient")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<RendezVous> rendezvous = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getNomero() {
        return nomero;
    }

    public Patient nomero(Long nomero) {
        this.nomero = nomero;
        return this;
    }

    public void setNomero(Long nomero) {
        this.nomero = nomero;
    }

    public String getNom() {
        return nom;
    }

    public Patient nom(String nom) {
        this.nom = nom;
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public Patient prenom(String prenom) {
        this.prenom = prenom;
        return this;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public Instant getDatenaissance() {
        return datenaissance;
    }

    public Patient datenaissance(Instant datenaissance) {
        this.datenaissance = datenaissance;
        return this;
    }

    public void setDatenaissance(Instant datenaissance) {
        this.datenaissance = datenaissance;
    }

    public String getLieunaissance() {
        return lieunaissance;
    }

    public Patient lieunaissance(String lieunaissance) {
        this.lieunaissance = lieunaissance;
        return this;
    }

    public void setLieunaissance(String lieunaissance) {
        this.lieunaissance = lieunaissance;
    }

    public String getAdresse() {
        return adresse;
    }

    public Patient adresse(String adresse) {
        this.adresse = adresse;
        return this;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public Genre getGenre() {
        return genre;
    }

    public Patient genre(Genre genre) {
        this.genre = genre;
        return this;
    }

    public void setGenre(Genre genre) {
        this.genre = genre;
    }

    public String getTelephone() {
        return telephone;
    }

    public Patient telephone(String telephone) {
        this.telephone = telephone;
        return this;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getCni() {
        return cni;
    }

    public Patient cni(String cni) {
        this.cni = cni;
        return this;
    }

    public void setCni(String cni) {
        this.cni = cni;
    }

    public String getPassword() {
        return password;
    }

    public Patient password(String password) {
        this.password = password;
        return this;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<Ordonnance> getOrdonances() {
        return ordonances;
    }

    public Patient ordonances(Set<Ordonnance> ordonnances) {
        this.ordonances = ordonnances;
        return this;
    }

    public Patient addOrdonance(Ordonnance ordonnance) {
        this.ordonances.add(ordonnance);
        ordonnance.setPatient(this);
        return this;
    }

    public Patient removeOrdonance(Ordonnance ordonnance) {
        this.ordonances.remove(ordonnance);
        ordonnance.setPatient(null);
        return this;
    }

    public void setOrdonances(Set<Ordonnance> ordonnances) {
        this.ordonances = ordonnances;
    }

    public Set<RendezVous> getRendezvous() {
        return rendezvous;
    }

    public Patient rendezvous(Set<RendezVous> rendezVous) {
        this.rendezvous = rendezVous;
        return this;
    }

    public Patient addRendezvous(RendezVous rendezVous) {
        this.rendezvous.add(rendezVous);
        rendezVous.setPatient(this);
        return this;
    }

    public Patient removeRendezvous(RendezVous rendezVous) {
        this.rendezvous.remove(rendezVous);
        rendezVous.setPatient(null);
        return this;
    }

    public void setRendezvous(Set<RendezVous> rendezVous) {
        this.rendezvous = rendezVous;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Patient)) {
            return false;
        }
        return id != null && id.equals(((Patient) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Patient{" +
            "id=" + getId() +
            ", nomero=" + getNomero() +
            ", nom='" + getNom() + "'" +
            ", prenom='" + getPrenom() + "'" +
            ", datenaissance='" + getDatenaissance() + "'" +
            ", lieunaissance='" + getLieunaissance() + "'" +
            ", adresse='" + getAdresse() + "'" +
            ", genre='" + getGenre() + "'" +
            ", telephone='" + getTelephone() + "'" +
            ", cni='" + getCni() + "'" +
            ", password='" + getPassword() + "'" +
            "}";
    }
}
