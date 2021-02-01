import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GestionPatientSharedModule } from 'app/shared/shared.module';
import { MedicamentComponent } from './medicament.component';
import { MedicamentDetailComponent } from './medicament-detail.component';
import { MedicamentUpdateComponent } from './medicament-update.component';
import { MedicamentDeleteDialogComponent } from './medicament-delete-dialog.component';
import { medicamentRoute } from './medicament.route';

@NgModule({
  imports: [GestionPatientSharedModule, RouterModule.forChild(medicamentRoute)],
  declarations: [MedicamentComponent, MedicamentDetailComponent, MedicamentUpdateComponent, MedicamentDeleteDialogComponent],
  entryComponents: [MedicamentDeleteDialogComponent],
})
export class GestionPatientMedicamentModule {}
