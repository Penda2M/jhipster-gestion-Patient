import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IPatient, Patient } from 'app/shared/model/patient.model';
import { PatientService } from './patient.service';

@Component({
  selector: 'jhi-patient-update',
  templateUrl: './patient-update.component.html',
})
export class PatientUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nomero: [],
    nom: [],
    prenom: [],
    datenaissance: [],
    lieunaissance: [],
    adresse: [],
    genre: [],
    telephone: [],
    cni: [],
    password: [],
  });

  constructor(protected patientService: PatientService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ patient }) => {
      if (!patient.id) {
        const today = moment().startOf('day');
        patient.datenaissance = today;
      }

      this.updateForm(patient);
    });
  }

  updateForm(patient: IPatient): void {
    this.editForm.patchValue({
      id: patient.id,
      nomero: patient.nomero,
      nom: patient.nom,
      prenom: patient.prenom,
      datenaissance: patient.datenaissance ? patient.datenaissance.format(DATE_TIME_FORMAT) : null,
      lieunaissance: patient.lieunaissance,
      adresse: patient.adresse,
      genre: patient.genre,
      telephone: patient.telephone,
      cni: patient.cni,
      password: patient.password,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const patient = this.createFromForm();
    if (patient.id !== undefined) {
      this.subscribeToSaveResponse(this.patientService.update(patient));
    } else {
      this.subscribeToSaveResponse(this.patientService.create(patient));
    }
  }

  private createFromForm(): IPatient {
    return {
      ...new Patient(),
      id: this.editForm.get(['id'])!.value,
      nomero: this.editForm.get(['nomero'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      prenom: this.editForm.get(['prenom'])!.value,
      datenaissance: this.editForm.get(['datenaissance'])!.value
        ? moment(this.editForm.get(['datenaissance'])!.value, DATE_TIME_FORMAT)
        : undefined,
      lieunaissance: this.editForm.get(['lieunaissance'])!.value,
      adresse: this.editForm.get(['adresse'])!.value,
      genre: this.editForm.get(['genre'])!.value,
      telephone: this.editForm.get(['telephone'])!.value,
      cni: this.editForm.get(['cni'])!.value,
      password: this.editForm.get(['password'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPatient>>): void {
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
}
