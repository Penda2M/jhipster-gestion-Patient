import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPatient } from 'app/shared/model/patient.model';
import { PatientService } from './patient.service';
import { PatientDeleteDialogComponent } from './patient-delete-dialog.component';

@Component({
  selector: 'jhi-patient',
  templateUrl: './patient.component.html',
})
export class PatientComponent implements OnInit, OnDestroy {
  patients?: IPatient[];
  eventSubscriber?: Subscription;
  currentSearch: string;

  constructor(
    protected patientService: PatientService,
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
      this.patientService
        .search({
          query: this.currentSearch,
        })
        .subscribe((res: HttpResponse<IPatient[]>) => (this.patients = res.body || []));
      return;
    }

    this.patientService.query().subscribe((res: HttpResponse<IPatient[]>) => (this.patients = res.body || []));
  }

  search(query: string): void {
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInPatients();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IPatient): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInPatients(): void {
    this.eventSubscriber = this.eventManager.subscribe('patientListModification', () => this.loadAll());
  }

  delete(patient: IPatient): void {
    const modalRef = this.modalService.open(PatientDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.patient = patient;
  }
}
