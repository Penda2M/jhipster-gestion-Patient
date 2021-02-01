import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GestionPatientSharedModule } from 'app/shared/shared.module';
import { TraitementComponent } from './traitement.component';
import { TraitementDetailComponent } from './traitement-detail.component';
import { TraitementUpdateComponent } from './traitement-update.component';
import { TraitementDeleteDialogComponent } from './traitement-delete-dialog.component';
import { traitementRoute } from './traitement.route';

@NgModule({
  imports: [GestionPatientSharedModule, RouterModule.forChild(traitementRoute)],
  declarations: [TraitementComponent, TraitementDetailComponent, TraitementUpdateComponent, TraitementDeleteDialogComponent],
  entryComponents: [TraitementDeleteDialogComponent],
})
export class GestionPatientTraitementModule {}
