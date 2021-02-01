import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IOrdonnance, Ordonnance } from 'app/shared/model/ordonnance.model';
import { OrdonnanceService } from './ordonnance.service';
import { IMedecin } from 'app/shared/model/medecin.model';
import { MedecinService } from 'app/entities/medecin/medecin.service';
import { IPatient } from 'app/shared/model/patient.model';
import { PatientService } from 'app/entities/patient/patient.service';

type SelectableEntity = IMedecin | IPatient;

@Component({
  selector: 'jhi-ordonnance-update',
  templateUrl: './ordonnance-update.component.html',
})
export class OrdonnanceUpdateComponent implements OnInit {
  isSaving = false;
  medecins: IMedecin[] = [];
  patients: IPatient[] = [];

  editForm = this.fb.group({
    id: [],
    date: [],
    medecin: [],
    patient: [],
  });

  constructor(
    protected ordonnanceService: OrdonnanceService,
    protected medecinService: MedecinService,
    protected patientService: PatientService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ordonnance }) => {
      if (!ordonnance.id) {
        const today = moment().startOf('day');
        ordonnance.date = today;
      }

      this.updateForm(ordonnance);

      this.medecinService.query().subscribe((res: HttpResponse<IMedecin[]>) => (this.medecins = res.body || []));

      this.patientService.query().subscribe((res: HttpResponse<IPatient[]>) => (this.patients = res.body || []));
    });
  }

  updateForm(ordonnance: IOrdonnance): void {
    this.editForm.patchValue({
      id: ordonnance.id,
      date: ordonnance.date ? ordonnance.date.format(DATE_TIME_FORMAT) : null,
      medecin: ordonnance.medecin,
      patient: ordonnance.patient,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ordonnance = this.createFromForm();
    if (ordonnance.id !== undefined) {
      this.subscribeToSaveResponse(this.ordonnanceService.update(ordonnance));
    } else {
      this.subscribeToSaveResponse(this.ordonnanceService.create(ordonnance));
    }
  }

  private createFromForm(): IOrdonnance {
    return {
      ...new Ordonnance(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value ? moment(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      medecin: this.editForm.get(['medecin'])!.value,
      patient: this.editForm.get(['patient'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrdonnance>>): void {
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
