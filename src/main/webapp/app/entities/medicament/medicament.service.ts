import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, Search } from 'app/shared/util/request-util';
import { IMedicament } from 'app/shared/model/medicament.model';

type EntityResponseType = HttpResponse<IMedicament>;
type EntityArrayResponseType = HttpResponse<IMedicament[]>;

@Injectable({ providedIn: 'root' })
export class MedicamentService {
  public resourceUrl = SERVER_API_URL + 'api/medicaments';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/medicaments';

  constructor(protected http: HttpClient) {}

  create(medicament: IMedicament): Observable<EntityResponseType> {
    return this.http.post<IMedicament>(this.resourceUrl, medicament, { observe: 'response' });
  }

  update(medicament: IMedicament): Observable<EntityResponseType> {
    return this.http.put<IMedicament>(this.resourceUrl, medicament, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMedicament>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMedicament[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: Search): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMedicament[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
