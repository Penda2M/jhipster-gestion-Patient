import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IService } from 'app/shared/model/service.model';
import { ServiceService } from './service.service';
import { ServiceDeleteDialogComponent } from './service-delete-dialog.component';

@Component({
  selector: 'jhi-service',
  templateUrl: './service.component.html',
})
export class ServiceComponent implements OnInit, OnDestroy {
  services?: IService[];
  eventSubscriber?: Subscription;
  currentSearch: string;

  constructor(
    protected serviceService: ServiceService,
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
      this.serviceService
        .search({
          query: this.currentSearch,
        })
        .subscribe((res: HttpResponse<IService[]>) => (this.services = res.body || []));
      return;
    }

    this.serviceService.query().subscribe((res: HttpResponse<IService[]>) => (this.services = res.body || []));
  }

  search(query: string): void {
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInServices();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IService): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInServices(): void {
    this.eventSubscriber = this.eventManager.subscribe('serviceListModification', () => this.loadAll());
  }

  delete(service: IService): void {
    const modalRef = this.modalService.open(ServiceDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.service = service;
  }
}
