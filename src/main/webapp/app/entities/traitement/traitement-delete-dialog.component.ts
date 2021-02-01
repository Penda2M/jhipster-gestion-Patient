import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITraitement } from 'app/shared/model/traitement.model';
import { TraitementService } from './traitement.service';

@Component({
  templateUrl: './traitement-delete-dialog.component.html',
})
export class TraitementDeleteDialogComponent {
  traitement?: ITraitement;

  constructor(
    protected traitementService: TraitementService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.traitementService.delete(id).subscribe(() => {
      this.eventManager.broadcast('traitementListModification');
      this.activeModal.close();
    });
  }
}
