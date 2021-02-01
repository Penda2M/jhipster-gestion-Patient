import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAdministrateur } from 'app/shared/model/administrateur.model';
import { AdministrateurService } from './administrateur.service';
import { AdministrateurDeleteDialogComponent } from './administrateur-delete-dialog.component';

@Component({
  selector: 'jhi-administrateur',
  templateUrl: './administrateur.component.html',
})
export class AdministrateurComponent implements OnInit, OnDestroy {
  administrateurs?: IAdministrateur[];
  eventSubscriber?: Subscription;
  currentSearch: string;

  constructor(
    protected administrateurService: AdministrateurService,
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
      this.administrateurService
        .search({
          query: this.currentSearch,
        })
        .subscribe((res: HttpResponse<IAdministrateur[]>) => (this.administrateurs = res.body || []));
      return;
    }

    this.administrateurService.query().subscribe((res: HttpResponse<IAdministrateur[]>) => (this.administrateurs = res.body || []));
  }

  search(query: string): void {
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInAdministrateurs();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IAdministrateur): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInAdministrateurs(): void {
    this.eventSubscriber = this.eventManager.subscribe('administrateurListModification', () => this.loadAll());
  }

  delete(administrateur: IAdministrateur): void {
    const modalRef = this.modalService.open(AdministrateurDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.administrateur = administrateur;
  }
}
