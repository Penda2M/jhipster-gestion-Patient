import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMedicament } from 'app/shared/model/medicament.model';
import { MedicamentService } from './medicament.service';
import { MedicamentDeleteDialogComponent } from './medicament-delete-dialog.component';

@Component({
  selector: 'jhi-medicament',
  templateUrl: './medicament.component.html',
})
export class MedicamentComponent implements OnInit, OnDestroy {
  medicaments?: IMedicament[];
  eventSubscriber?: Subscription;
  currentSearch: string;

  constructor(
    protected medicamentService: MedicamentService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected activatedRoute: ActivatedRoute
  ) {
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams['search']
        ? this.activatedRoute.snapshot.queryParams['search']
        : '';
  }

  loadAll(): void {
    if (this.currentSearch) {
      this.medicamentService
        .search({
          query: this.currentSearch,
        })
        .subscribe((res: HttpResponse<IMedicament[]>) => (this.medicaments = res.body || []));
      return;
    }

    this.medicamentService.query().subscribe((res: HttpResponse<IMedicament[]>) => (this.medicaments = res.body || []));
  }

  search(query: string): void {
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInMedicaments();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IMedicament): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInMedicaments(): void {
    this.eventSubscriber = this.eventManager.subscribe('medicamentListModification', () => this.loadAll());
  }

  delete(medicament: IMedicament): void {
    const modalRef = this.modalService.open(MedicamentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.medicament = medicament;
  }
}
