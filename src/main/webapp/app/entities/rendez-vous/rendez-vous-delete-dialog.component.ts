import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IRendezVous } from 'app/shared/model/rendez-vous.model';
import { RendezVousService } from './rendez-vous.service';

@Component({
  templateUrl: './rendez-vous-delete-dialog.component.html',
})
export class RendezVousDeleteDialogComponent {
  rendezVous?: IRendezVous;

  constructor(
    protected rendezVousService: RendezVousService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.rendezVousService.delete(id).subscribe(() => {
      this.eventManager.broadcast('rendezVousListModification');
      this.activeModal.close();
    });
  }
}
