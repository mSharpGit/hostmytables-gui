import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Customer } from '../structures/customer';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  customer: Customer
  private customerSource = new BehaviorSubject(this.customer);
  currentCustomer = this.customerSource.asObservable();
  constructor() { }

  changeCustomer(customer: Customer) {
    this.customerSource.next(customer)
  }
  
}
