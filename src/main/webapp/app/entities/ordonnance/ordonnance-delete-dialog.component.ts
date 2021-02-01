import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IOrdonnance } from 'app/shared/model/ordonnance.model';
import { OrdonnanceService } from './ordonnance.service';

@Component({
  templateUrl: './ordonnance-delete-dialog.component.html',
})
export class OrdonnanceDeleteDialogComponent {
  ordonnance?: IOrdonnance;

  constructor(
    protected ordonnanceService: OrdonnanceService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ordonnanceService.delete(id).subscribe(() => {
      this.eventManager.broadcast('ordonnanceListModification');
      this.activeModal.close();
    });
  }
}
