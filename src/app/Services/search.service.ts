import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { API } from '../app.constants';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { ISearchResult } from '../models/search.model';

@Injectable()
export class SearchService
{

  constructor(
    private httpClient: HttpClient,
    private userService: UserService
  ) { }

  public getSearchHistory(): Observable<Array<string>>
  {
    const header: HttpHeaders = new HttpHeaders({ 'Authorization': `Bearer ${this.userService.user.token}` });
    return this.httpClient.get(API.history, {
      headers: header
    }) as Observable<Array<string>>;
  }

  public search(term: string): Observable<Array<ISearchResult>>
  {
    const params: HttpParams = new HttpParams().set('term', term);
    const header: HttpHeaders = new HttpHeaders({ 'Authorization': `Bearer ${this.userService.user.token}` });
    return this.httpClient.get(API.search, {
      headers: header,
      params: params
    }) as Observable<Array<ISearchResult>>;
  }
}
