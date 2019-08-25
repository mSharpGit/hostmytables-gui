import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/structures/customer';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatDialog } from '@angular/material';
import { CustomerService } from 'src/app/services/customer.service';
import { AddGuestComponent } from '../components/add-guest/add-guest.component';
import { DataService } from 'src/app/services/data.service';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  customers: Customer[] ;
  restaurant_id: number;
  ADD = false;
  constructor(private authenticationService: AuthenticationService,
    public dialog: MatDialog,
    private customerService: CustomerService,
    private data: DataService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.restaurant_id = this.authenticationService.getRestuarantID();
    this.getCustomers(this.restaurant_id);
  }

  getCustomers(id){
    this.customerService.getCustomers(id)
    .subscribe(customer => {this.customers = customer;
    });
  }

  openGuestDialog(type): void {
    this.router.navigate(['webapp/customer', type]);
    //var customerv = new Customer()
    //this.data.currentCustomer.subscribe(customer => customer = customerv)
   /*  if (type === 'ADD'){
      this.ADD = true;
    } */
    /* const dialogRef = this.dialog.open(AddGuestComponent, {
      width: '850px',
      data: { 
        customer: new Customer(),
        type: type
      }
    });

    const sub = dialogRef.componentInstance.onClose.subscribe((data) => {
      console.log('Dialog closing data', data.id);
      this.customer.push(data);
      

    });

    dialogRef.afterClosed().subscribe(result => {

      console.log('The dialog was closed');
      //this.name = result;
    }); */
  }

  openGuestEditDialog(customer, type): void {
    this.data.changeCustomer(customer);
    //this.router.navigate(['webapp/customer/', { type: type}], { relativeTo: this.route });
    this.router.navigate(['webapp/customer', type]);
    /* const dialogRef = this.dialog.open(AddGuestComponent, {
      width: '850px',
      data: { 
        customer: customer,
        type: type
      }
    });

    const sub = dialogRef.componentInstance.onClose.subscribe((data) => {
      console.log('Dialog closing data', data.id);
      this.filterCustomer(customer)[0] = customer;
      //this.customer.push(data);

    });

    dialogRef.afterClosed().subscribe(result => {

      console.log('The dialog was closed');
      //this.name = result;
    }); */
  }

  filterCustomer(customer){
   return this.customers.filter(c => {c.id === customer.id})
  }

  deleteCustomer(customer: Customer){
    //this.authenticationService.getRestuarantID()
    this.customerService.deleteCustomer(customer)
    .subscribe(result => {
      this.customers = this.customers.filter(c => c !== customer);
    });
    
  }

}
