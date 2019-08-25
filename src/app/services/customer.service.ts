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
  private customerUrl = this.url + '/customer';

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

  getCustomerBatch(ids): Observable<Customer[]> {
    const url = this.apiUrl+"/batch/("+ids.join(',')+")";
   return this.http.get<Customer[]>(url).pipe(
     tap(customers => console.log(`fetched customers`, customers))
   ); 
 }

 
 editCustomer(customer: Customer): Observable<Customer> {
  return this.http.put<Customer>(this.customerUrl+'/'+ customer.id, customer, httpOptions).pipe(
   tap((customer: Customer) => {console.log('Customer updated', customer)
 }));
}

 deleteCustomer (customer: Customer): Observable<Customer> {
  const id = typeof customer === 'number' ? customer : customer.id;
  const url = `${this.customerUrl}/${id}`;
  return this.http.delete<Customer>(url, httpOptions).pipe(
    tap(_ => console.log(`deleted customer id=${id}`))
  );
}
}
