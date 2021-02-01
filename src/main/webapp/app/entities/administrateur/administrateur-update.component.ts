import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IAdministrateur, Administrateur } from 'app/shared/model/administrateur.model';
import { AdministrateurService } from './administrateur.service';

@Component({
  selector: 'jhi-administrateur-update',
  templateUrl: './administrateur-update.component.html',
})
export class AdministrateurUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nom: [],
    prenom: [],
    email: [],
    password: [],
  });

  constructor(protected administrateurService: AdministrateurService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ administrateur }) => {
      this.updateForm(administrateur);
    });
  }

  updateForm(administrateur: IAdministrateur): void {
    this.editForm.patchValue({
      id: administrateur.id,
      nom: administrateur.nom,
      prenom: administrateur.prenom,
      email: administrateur.email,
      password: administrateur.password,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const administrateur = this.createFromForm();
    if (administrateur.id !== undefined) {
      this.subscribeToSaveResponse(this.administrateurService.update(administrateur));
    } else {
      this.subscribeToSaveResponse(this.administrateurService.create(administrateur));
    }
  }

  private createFromForm(): IAdministrateur {
    return {
      ...new Administrateur(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      prenom: this.editForm.get(['prenom'])!.value,
      email: this.editForm.get(['email'])!.value,
      password: this.editForm.get(['password'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAdministrateur>>): void {
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
