import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IMedicament } from 'app/shared/model/medicament.model';
import { MedicamentService } from './medicament.service';

@Component({
  templateUrl: './medicament-delete-dialog.component.html',
})
export class MedicamentDeleteDialogComponent {
  medicament?: IMedicament;

  constructor(
    protected medicamentService: MedicamentService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.medicamentService.delete(id).subscribe(() => {
      this.eventManager.broadcast('medicamentListModification');
      this.activeModal.close();
    });
  }
}
