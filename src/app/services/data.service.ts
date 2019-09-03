import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Customer } from '../structures/customer';
import { Table } from '../structures/table';
import { Floor } from '../structures/floor';
import { Occupy } from '../structures/occupy';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  customer: Customer
  private customerSource = new BehaviorSubject(this.customer);
  currentCustomer = this.customerSource.asObservable();

  table: Table
  private tableSource = new BehaviorSubject(this.table);
  currentTable = this.tableSource.asObservable();


  floor: Floor
  private floorSource = new BehaviorSubject(this.floor);
  currentFloor = this.floorSource.asObservable();

  occupy: Occupy
  private occupySource = new BehaviorSubject(this.occupy);
  currentOccupy = this.occupySource.asObservable();

  date: String
  private dateSource = new BehaviorSubject(this.date);
  currentdate = this.dateSource.asObservable();

  constructor() { }

  changeCustomer(customer: Customer) {
    this.customerSource.next(customer)
  }
  
  changeTable(table: Table) {
    this.tableSource.next(table)
  }

  changeFloor(floor: Floor) {
    this.floorSource.next(floor)
  }

  changeOccupy(occupy: Occupy) {
    this.occupySource.next(occupy)
  }

  changeDatey(date: String) {
    this.dateSource.next(date)
  }

}
