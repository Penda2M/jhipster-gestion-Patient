import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRendezVous } from 'app/shared/model/rendez-vous.model';
import { RendezVousService } from './rendez-vous.service';
import { RendezVousDeleteDialogComponent } from './rendez-vous-delete-dialog.component';

@Component({
  selector: 'jhi-rendez-vous',
  templateUrl: './rendez-vous.component.html',
})
export class RendezVousComponent implements OnInit, OnDestroy {
  rendezVous?: IRendezVous[];
  eventSubscriber?: Subscription;
  currentSearch: string;

  constructor(
    protected rendezVousService: RendezVousService,
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
      this.rendezVousService
        .search({
          query: this.currentSearch,
        })
        .subscribe((res: HttpResponse<IRendezVous[]>) => (this.rendezVous = res.body || []));
      return;
    }

    this.rendezVousService.query().subscribe((res: HttpResponse<IRendezVous[]>) => (this.rendezVous = res.body || []));
  }

  search(query: string): void {
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInRendezVous();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IRendezVous): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInRendezVous(): void {
    this.eventSubscriber = this.eventManager.subscribe('rendezVousListModification', () => this.loadAll());
  }

  delete(rendezVous: IRendezVous): void {
    const modalRef = this.modalService.open(RendezVousDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.rendezVous = rendezVous;
  }
}
