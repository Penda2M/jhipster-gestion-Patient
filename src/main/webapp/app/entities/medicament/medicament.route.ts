import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IMedicament, Medicament } from 'app/shared/model/medicament.model';
import { MedicamentService } from './medicament.service';
import { MedicamentComponent } from './medicament.component';
import { MedicamentDetailComponent } from './medicament-detail.component';
import { MedicamentUpdateComponent } from './medicament-update.component';

@Injectable({ providedIn: 'root' })
export class MedicamentResolve implements Resolve<IMedicament> {
  constructor(private service: MedicamentService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMedicament> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((medicament: HttpResponse<Medicament>) => {
          if (medicament.body) {
            return of(medicament.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Medicament());
  }
}

export const medicamentRoute: Routes = [
  {
    path: '',
    component: MedicamentComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'gestionPatientApp.medicament.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MedicamentDetailComponent,
    resolve: {
      medicament: MedicamentResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'gestionPatientApp.medicament.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MedicamentUpdateComponent,
    resolve: {
      medicament: MedicamentResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'gestionPatientApp.medicament.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MedicamentUpdateComponent,
    resolve: {
      medicament: MedicamentResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'gestionPatientApp.medicament.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
