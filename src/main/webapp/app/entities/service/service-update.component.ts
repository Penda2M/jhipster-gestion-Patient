import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IService, Service } from 'app/shared/model/service.model';
import { ServiceService } from './service.service';
import { IAdministrateur } from 'app/shared/model/administrateur.model';
import { AdministrateurService } from 'app/entities/administrateur/administrateur.service';

@Component({
  selector: 'jhi-service-update',
  templateUrl: './service-update.component.html',
})
export class ServiceUpdateComponent implements OnInit {
  isSaving = false;
  administrateurs: IAdministrateur[] = [];

  editForm = this.fb.group({
    id: [],
    nomservice: [],
    administrateur: [],
  });

  constructor(
    protected serviceService: ServiceService,
    protected administrateurService: AdministrateurService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ service }) => {
      this.updateForm(service);

      this.administrateurService.query().subscribe((res: HttpResponse<IAdministrateur[]>) => (this.administrateurs = res.body || []));
    });
  }

  updateForm(service: IService): void {
    this.editForm.patchValue({
      id: service.id,
      nomservice: service.nomservice,
      administrateur: service.administrateur,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const service = this.createFromForm();
    if (service.id !== undefined) {
      this.subscribeToSaveResponse(this.serviceService.update(service));
    } else {
      this.subscribeToSaveResponse(this.serviceService.create(service));
    }
  }

  private createFromForm(): IService {
    return {
      ...new Service(),
      id: this.editForm.get(['id'])!.value,
      nomservice: this.editForm.get(['nomservice'])!.value,
      administrateur: this.editForm.get(['administrateur'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IService>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IAdministrateur): any {
    return item.id;
  }
}
