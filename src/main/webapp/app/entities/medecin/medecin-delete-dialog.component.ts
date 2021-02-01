import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IMedecin } from 'app/shared/model/medecin.model';
import { MedecinService } from './medecin.service';

@Component({
  templateUrl: './medecin-delete-dialog.component.html',
})
export class MedecinDeleteDialogComponent {
  medecin?: IMedecin;

  constructor(protected medecinService: MedecinService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.medecinService.delete(id).subscribe(() => {
      this.eventManager.broadcast('medecinListModification');
      this.activeModal.close();
    });
  }
}
