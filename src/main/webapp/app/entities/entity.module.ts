import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'medecin',
        loadChildren: () => import('./medecin/medecin.module').then(m => m.GestionPatientMedecinModule),
      },
      {
        path: 'patient',
        loadChildren: () => import('./patient/patient.module').then(m => m.GestionPatientPatientModule),
      },
      {
        path: 'service',
        loadChildren: () => import('./service/service.module').then(m => m.GestionPatientServiceModule),
      },
      {
        path: 'ordonnance',
        loadChildren: () => import('./ordonnance/ordonnance.module').then(m => m.GestionPatientOrdonnanceModule),
      },
      {
        path: 'medicament',
        loadChildren: () => import('./medicament/medicament.module').then(m => m.GestionPatientMedicamentModule),
      },
      {
        path: 'administrateur',
        loadChildren: () => import('./administrateur/administrateur.module').then(m => m.GestionPatientAdministrateurModule),
      },
      {
        path: 'rendez-vous',
        loadChildren: () => import('./rendez-vous/rendez-vous.module').then(m => m.GestionPatientRendezVousModule),
      },
      {
        path: 'traitement',
        loadChildren: () => import('./traitement/traitement.module').then(m => m.GestionPatientTraitementModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class GestionPatientEntityModule {}
