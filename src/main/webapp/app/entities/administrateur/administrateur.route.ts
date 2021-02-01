import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IAdministrateur, Administrateur } from 'app/shared/model/administrateur.model';
import { AdministrateurService } from './administrateur.service';
import { AdministrateurComponent } from './administrateur.component';
import { AdministrateurDetailComponent } from './administrateur-detail.component';
import { AdministrateurUpdateComponent } from './administrateur-update.component';

@Injectable({ providedIn: 'root' })
export class AdministrateurResolve implements Resolve<IAdministrateur> {
  constructor(private service: AdministrateurService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAdministrateur> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((administrateur: HttpResponse<Administrateur>) => {
          if (administrateur.body) {
            return of(administrateur.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Administrateur());
  }
}

export const administrateurRoute: Routes = [
  {
    path: '',
    component: AdministrateurComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'gestionPatientApp.administrateur.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AdministrateurDetailComponent,
    resolve: {
      administrateur: AdministrateurResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'gestionPatientApp.administrateur.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AdministrateurUpdateComponent,
    resolve: {
      administrateur: AdministrateurResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'gestionPatientApp.administrateur.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AdministrateurUpdateComponent,
    resolve: {
      administrateur: AdministrateurResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'gestionPatientApp.administrateur.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
