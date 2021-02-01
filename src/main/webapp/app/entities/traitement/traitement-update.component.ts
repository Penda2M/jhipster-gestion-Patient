import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ITraitement, Traitement } from 'app/shared/model/traitement.model';
import { TraitementService } from './traitement.service';
import { IOrdonnance } from 'app/shared/model/ordonnance.model';
import { OrdonnanceService } from 'app/entities/ordonnance/ordonnance.service';
import { IMedicament } from 'app/shared/model/medicament.model';
import { MedicamentService } from 'app/entities/medicament/medicament.service';

type SelectableEntity = IOrdonnance | IMedicament;

@Component({
  selector: 'jhi-traitement-update',
  templateUrl: './traitement-update.component.html',
})
export class TraitementUpdateComponent implements OnInit {
  isSaving = false;
  ordonnances: IOrdonnance[] = [];
  medicaments: IMedicament[] = [];

  editForm = this.fb.group({
    id: [],
    idTraitement: [],
    frais: [],
    ordonance: [],
    medicament: [],
  });

  constructor(
    protected traitementService: TraitementService,
    protected ordonnanceService: OrdonnanceService,
    protected medicamentService: MedicamentService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ traitement }) => {
      this.updateForm(traitement);

      this.ordonnanceService.query().subscribe((res: HttpResponse<IOrdonnance[]>) => (this.ordonnances = res.body || []));

      this.medicamentService.query().subscribe((res: HttpResponse<IMedicament[]>) => (this.medicaments = res.body || []));
    });
  }

  updateForm(traitement: ITraitement): void {
    this.editForm.patchValue({
      id: traitement.id,
      idTraitement: traitement.idTraitement,
      frais: traitement.frais,
      ordonance: traitement.ordonance,
      medicament: traitement.medicament,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const traitement = this.createFromForm();
    if (traitement.id !== undefined) {
      this.subscribeToSaveResponse(this.traitementService.update(traitement));
    } else {
      this.subscribeToSaveResponse(this.traitementService.create(traitement));
    }
  }

  private createFromForm(): ITraitement {
    return {
      ...new Traitement(),
      id: this.editForm.get(['id'])!.value,
      idTraitement: this.editForm.get(['idTraitement'])!.value,
      frais: this.editForm.get(['frais'])!.value,
      ordonance: this.editForm.get(['ordonance'])!.value,
      medicament: this.editForm.get(['medicament'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITraitement>>): void {
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

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
