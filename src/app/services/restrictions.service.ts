import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FoodRestrictions, FoodRestrictionLink } from '../structures/customer';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RestrictionsService {

  private url = environment.apiUrl;
  private restrictionUrl = this.url + '/foodrestrictions';

  constructor(
    private http: HttpClient
  ) { }

  getRestriction(id): Observable<FoodRestrictions[]> {
    return this.http.get<FoodRestrictions[]>(this.restrictionUrl + "/link/" + id, httpOptions).pipe(
      tap(foodRestrictions => console.log('fetched food Restrictions', foodRestrictions))
    );
  }
  
  getRestrictions(): Observable<FoodRestrictions[]> {
    return this.http.get<FoodRestrictions[]>(this.restrictionUrl, httpOptions).pipe(
      tap(foodRestrictions => console.log('fetched food Restrictions', foodRestrictions))
    );
  }

  addRestriction(foodRestriction: FoodRestrictions): Observable<FoodRestrictions> {
    return this.http.post<FoodRestrictions>(this.restrictionUrl, foodRestriction, httpOptions).pipe(
      tap((foodRestriction: FoodRestrictions) => {
        console.log('New Restriction added', foodRestriction)
      }));
  }
  
  
  addRestrictionLink(foodRestrictionLink: FoodRestrictionLink[]): Observable<FoodRestrictionLink[]> {
    console.log('strigifiy:', JSON.stringify(foodRestrictionLink), foodRestrictionLink)
    return this.http.post<FoodRestrictionLink[]>(this.restrictionUrl+'/link', JSON.stringify(foodRestrictionLink), httpOptions).pipe(
      tap((foodRestrictionLink: FoodRestrictionLink[]) => {
        console.log('New Restriction link added', foodRestrictionLink)
      }));
  }

  deleteCustRestrictions (id): Observable<FoodRestrictionLink> {
    return this.http.delete<FoodRestrictionLink>(this.restrictionUrl+'/link/' + id, httpOptions).pipe(
      tap(_ => console.log(`deleted restriction id=${id}`))
    ); 
  }
  
}
