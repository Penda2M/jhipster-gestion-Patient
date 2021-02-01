import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrdonnance } from 'app/shared/model/ordonnance.model';
import { OrdonnanceService } from './ordonnance.service';
import { OrdonnanceDeleteDialogComponent } from './ordonnance-delete-dialog.component';

@Component({
  selector: 'jhi-ordonnance',
  templateUrl: './ordonnance.component.html',
})
export class OrdonnanceComponent implements OnInit, OnDestroy {
  ordonnances?: IOrdonnance[];
  eventSubscriber?: Subscription;
  currentSearch: string;

  constructor(
    protected ordonnanceService: OrdonnanceService,
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
      this.ordonnanceService
        .search({
          query: this.currentSearch,
        })
        .subscribe((res: HttpResponse<IOrdonnance[]>) => (this.ordonnances = res.body || []));
      return;
    }

    this.ordonnanceService.query().subscribe((res: HttpResponse<IOrdonnance[]>) => (this.ordonnances = res.body || []));
  }

  search(query: string): void {
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInOrdonnances();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IOrdonnance): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInOrdonnances(): void {
    this.eventSubscriber = this.eventManager.subscribe('ordonnanceListModification', () => this.loadAll());
  }

  delete(ordonnance: IOrdonnance): void {
    const modalRef = this.modalService.open(OrdonnanceDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.ordonnance = ordonnance;
  }
}
