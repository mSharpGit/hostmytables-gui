import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Customer, FoodRestrictions, FoodAllergies, FoodRestrictionLink, FoodAllergyLink } from '../structures/customer';
import { tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private url = environment.apiUrl;
  private apiUrl = this.url + '/customers';
  private restrictionUrl = this.url + '/foodrestrictions';
  private allergyUrl = this.url + '/foodallergies';
  private customerUrl = this.url + '/customers';

  constructor(private router: Router,
    private http: HttpClient, ) { }

  getCustomers(id: number): Observable<Customer[]> {

    return this.http.get<Customer[]>(this.apiUrl + "/" + id, httpOptions).pipe(
      tap(customer => console.log('fetched customers', customer))
    );
  }

  search(term: string): Observable<Customer[]> {
    console.log('customer service called :', term)
    return this.http
      .get<Customer[]>(this.apiUrl + "/search/" + term, httpOptions).pipe(
        tap(customer => console.log('searched customers', customer))
      );
  }

  addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer, httpOptions).pipe(
      tap((customer: Customer) => {
        console.log('New Customer added', customer)
      }));
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

  addRestrictionLink(foodRestrictionLink: FoodRestrictionLink): Observable<FoodRestrictionLink> {
    return this.http.post<FoodRestrictionLink>(this.restrictionUrl+'/link', foodRestrictionLink, httpOptions).pipe(
      tap((foodRestrictionLink: FoodRestrictionLink) => {
        console.log('New Restriction link added', foodRestrictionLink)
      }));
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

  addAllergyLink(foodAllergyLink: FoodAllergyLink): Observable<FoodAllergyLink> {
    return this.http.post<FoodAllergyLink>(this.allergyUrl+'/link', foodAllergyLink, httpOptions).pipe(
      tap((foodAllergyLink: FoodAllergyLink) => {
        console.log('New Allergy link added', foodAllergyLink)
      }));
  }

  getCustomerBatch(ids): Observable<Customer[]> {
    const url = this.apiUrl+"/batch/("+ids.join(',')+")";
   return this.http.get<Customer[]>(url).pipe(
     tap(customers => console.log(`fetched customers`, customers))
   ); 
 }
}
