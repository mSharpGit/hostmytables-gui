import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FoodAllergies, FoodAllergyLink } from '../structures/customer';
import { tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class AllergiesService {

  private url = environment.apiUrl;
  private allergyUrl = this.url + '/foodallergies';
  constructor(
    private http: HttpClient) {
   }

  
   getAllergy(id): Observable<FoodAllergies[]> {
    return this.http.get<FoodAllergies[]>(this.allergyUrl + "/link/" + id, httpOptions).pipe(
      tap(foodAllergies => console.log('fetched Food Allergies', foodAllergies))
    );
  }

  getAllergies(): Observable<FoodAllergies[]> {
    return this.http.get<FoodAllergies[]>(this.allergyUrl, httpOptions).pipe(
      tap(foodAllergies => console.log('fetched Food Allergies', foodAllergies))
    );
  }

  addAllergy(foodAllergies: FoodAllergies): Observable<FoodAllergies> {
    return this.http.post<FoodAllergies>(this.allergyUrl, foodAllergies, httpOptions).pipe(
      tap((foodAllergies: FoodAllergies) => {
        console.log('New Allergy added', foodAllergies)
      }));
  }

  addAllergyLink(foodAllergyLink: FoodAllergyLink[]): Observable<FoodAllergyLink[]> {
    return this.http.post<FoodAllergyLink[]>(this.allergyUrl+'/link', foodAllergyLink, httpOptions).pipe(
      tap((foodAllergyLink: FoodAllergyLink[]) => {
        console.log('New Allergy link added', foodAllergyLink)
      }));
  }
  

  deleteCustAllergies (id): Observable<FoodAllergyLink> {
    return this.http.delete<FoodAllergyLink>(this.allergyUrl+'/link/' + id, httpOptions).pipe(
      tap(_ => console.log(`deleted allergy id=${id}`))
    ); 
  }
}
