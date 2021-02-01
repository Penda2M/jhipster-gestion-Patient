import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, Search } from 'app/shared/util/request-util';
import { IAdministrateur } from 'app/shared/model/administrateur.model';

type EntityResponseType = HttpResponse<IAdministrateur>;
type EntityArrayResponseType = HttpResponse<IAdministrateur[]>;

@Injectable({ providedIn: 'root' })
export class AdministrateurService {
  public resourceUrl = SERVER_API_URL + 'api/administrateurs';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/administrateurs';

  constructor(protected http: HttpClient) {}

  create(administrateur: IAdministrateur): Observable<EntityResponseType> {
    return this.http.post<IAdministrateur>(this.resourceUrl, administrateur, { observe: 'response' });
  }

  update(administrateur: IAdministrateur): Observable<EntityResponseType> {
    return this.http.put<IAdministrateur>(this.resourceUrl, administrateur, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAdministrateur>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAdministrateur[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: Search): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAdministrateur[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
