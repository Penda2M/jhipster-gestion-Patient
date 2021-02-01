import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GestionPatientSharedModule } from 'app/shared/shared.module';
import { AdministrateurComponent } from './administrateur.component';
import { AdministrateurDetailComponent } from './administrateur-detail.component';
import { AdministrateurUpdateComponent } from './administrateur-update.component';
import { AdministrateurDeleteDialogComponent } from './administrateur-delete-dialog.component';
import { administrateurRoute } from './administrateur.route';

@NgModule({
  imports: [GestionPatientSharedModule, RouterModule.forChild(administrateurRoute)],
  declarations: [
    AdministrateurComponent,
    AdministrateurDetailComponent,
    AdministrateurUpdateComponent,
    AdministrateurDeleteDialogComponent,
  ],
  entryComponents: [AdministrateurDeleteDialogComponent],
})
export class GestionPatientAdministrateurModule {}
