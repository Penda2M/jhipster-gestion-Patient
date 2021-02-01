import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IRendezVous, RendezVous } from 'app/shared/model/rendez-vous.model';
import { RendezVousService } from './rendez-vous.service';
import { IMedecin } from 'app/shared/model/medecin.model';
import { MedecinService } from 'app/entities/medecin/medecin.service';
import { IPatient } from 'app/shared/model/patient.model';
import { PatientService } from 'app/entities/patient/patient.service';

type SelectableEntity = IMedecin | IPatient;

@Component({
  selector: 'jhi-rendez-vous-update',
  templateUrl: './rendez-vous-update.component.html',
})
export class RendezVousUpdateComponent implements OnInit {
  isSaving = false;
  medecins: IMedecin[] = [];
  patients: IPatient[] = [];

  editForm = this.fb.group({
    id: [],
    idRv: [],
    dateRv: [],
    medecin: [],
    patient: [],
  });

  constructor(
    protected rendezVousService: RendezVousService,
    protected medecinService: MedecinService,
    protected patientService: PatientService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rendezVous }) => {
      if (!rendezVous.id) {
        const today = moment().startOf('day');
        rendezVous.dateRv = today;
      }

      this.updateForm(rendezVous);

      this.medecinService.query().subscribe((res: HttpResponse<IMedecin[]>) => (this.medecins = res.body || []));

      this.patientService.query().subscribe((res: HttpResponse<IPatient[]>) => (this.patients = res.body || []));
    });
  }

  updateForm(rendezVous: IRendezVous): void {
    this.editForm.patchValue({
      id: rendezVous.id,
      idRv: rendezVous.idRv,
      dateRv: rendezVous.dateRv ? rendezVous.dateRv.format(DATE_TIME_FORMAT) : null,
      medecin: rendezVous.medecin,
      patient: rendezVous.patient,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const rendezVous = this.createFromForm();
    if (rendezVous.id !== undefined) {
      this.subscribeToSaveResponse(this.rendezVousService.update(rendezVous));
    } else {
      this.subscribeToSaveResponse(this.rendezVousService.create(rendezVous));
    }
  }

  private createFromForm(): IRendezVous {
    return {
      ...new RendezVous(),
      id: this.editForm.get(['id'])!.value,
      idRv: this.editForm.get(['idRv'])!.value,
      dateRv: this.editForm.get(['dateRv'])!.value ? moment(this.editForm.get(['dateRv'])!.value, DATE_TIME_FORMAT) : undefined,
      medecin: this.editForm.get(['medecin'])!.value,
      patient: this.editForm.get(['patient'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRendezVous>>): void {
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
