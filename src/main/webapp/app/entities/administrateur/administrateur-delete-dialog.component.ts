import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IAdministrateur } from 'app/shared/model/administrateur.model';
import { AdministrateurService } from './administrateur.service';

@Component({
  templateUrl: './administrateur-delete-dialog.component.html',
})
export class AdministrateurDeleteDialogComponent {
  administrateur?: IAdministrateur;

  constructor(
    protected administrateurService: AdministrateurService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.administrateurService.delete(id).subscribe(() => {
      this.eventManager.broadcast('administrateurListModification');
      this.activeModal.close();
    });
  }
}
