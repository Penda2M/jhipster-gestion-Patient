import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, Search } from 'app/shared/util/request-util';
import { ITraitement } from 'app/shared/model/traitement.model';

type EntityResponseType = HttpResponse<ITraitement>;
type EntityArrayResponseType = HttpResponse<ITraitement[]>;

@Injectable({ providedIn: 'root' })
export class TraitementService {
  public resourceUrl = SERVER_API_URL + 'api/traitements';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/traitements';

  constructor(protected http: HttpClient) {}

  create(traitement: ITraitement): Observable<EntityResponseType> {
    return this.http.post<ITraitement>(this.resourceUrl, traitement, { observe: 'response' });
  }

  update(traitement: ITraitement): Observable<EntityResponseType> {
    return this.http.put<ITraitement>(this.resourceUrl, traitement, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITraitement>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITraitement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: Search): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITraitement[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
