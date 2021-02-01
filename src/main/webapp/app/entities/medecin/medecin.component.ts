import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMedecin } from 'app/shared/model/medecin.model';
import { MedecinService } from './medecin.service';
import { MedecinDeleteDialogComponent } from './medecin-delete-dialog.component';

@Component({
  selector: 'jhi-medecin',
  templateUrl: './medecin.component.html',
})
export class MedecinComponent implements OnInit, OnDestroy {
  medecins?: IMedecin[];
  eventSubscriber?: Subscription;
  currentSearch: string;

  constructor(
    protected medecinService: MedecinService,
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
      this.medecinService
        .search({
          query: this.currentSearch,
        })
        .subscribe((res: HttpResponse<IMedecin[]>) => (this.medecins = res.body || []));
      return;
    }

    this.medecinService.query().subscribe((res: HttpResponse<IMedecin[]>) => (this.medecins = res.body || []));
  }

  search(query: string): void {
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInMedecins();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IMedecin): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInMedecins(): void {
    this.eventSubscriber = this.eventManager.subscribe('medecinListModification', () => this.loadAll());
  }

  delete(medecin: IMedecin): void {
    const modalRef = this.modalService.open(MedecinDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.medecin = medecin;
  }
}
