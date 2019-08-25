import { Component, OnInit, Inject, Input, HostBinding } from '@angular/core';
import { ReservationsService } from 'src/app/services/reservations.service';
import { Occupy } from 'src/app/structures/occupy';
import { TablesService } from 'src/app/services/tables.service';
import { Table, Tableid } from 'src/app/structures/table';
import { AuthenticationService } from 'src/app/services/authentication.service';
import {MatDialog, MatDatepickerInputEvent} from '@angular/material';

// Observable class extensions
import 'rxjs/add/observable/of';
// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { AddReservationComponent } from '../components/add-reservation/add-reservation.component';
import { Customer } from 'src/app/structures/customer';
import { CustomerService } from 'src/app/services/customer.service';
import { FormControl } from '@angular/forms';
import * as moment from "moment";




@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.css']
})
export class ReserveComponent implements OnInit {

  @HostBinding('class.is-open')
  
  odate = new FormControl(moment().format('YYYY-MM-DD'));
  occupy: Occupy[];
  table: Table;
  tables: Table[];
  customers: Customer[];
  animal: string;
  name: string;
  restaurant_id: number;

  

  constructor(private reservationsService: ReservationsService,
    private authenticationService: AuthenticationService,
    private tablesService: TablesService,
    public dialog: MatDialog,
    private customerService: CustomerService) { }

  ngOnInit() {
    this.restaurant_id = this.authenticationService.getRestuarantID();
    this.getReservations(this.restaurant_id,this.odate.value);

   /*  if (this.eventEmitterService.subsVar==undefined) {    
      this.eventEmitterService.subsVar = this.eventEmitterService.invokeGetReservationFunction.subscribe((name:string) => {    
        this.getReservations();    
      });    
    }  */
  }


  openAddDialog(type): void {
    const dialogRef = this.dialog.open(AddReservationComponent, {
      width: '850px',
      data: { date: this.odate.value, type: type}
    });

    const sub = dialogRef.componentInstance.onCloseAddReserve.subscribe((data) => {
      console.log('Dialog closing data', data);
      this.customers = null;
      this.tables = null;
      this.getReservations(this.restaurant_id, this.odate.value);
     });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  openUpdateDialog(occupy, table, customer): void {
    //console.log(occupy,table,customer)
    const dialogRef = this.dialog.open(AddReservationComponent, {
      width: '850px',
      data: {occupy: occupy, table: table, customer: customer, type: 'EDIT'}
    });

    const sub = dialogRef.componentInstance.onCloseAddReserve.subscribe((data) => {
      console.log('Dialog closing data', data);
      this.customers = null;
      this.tables = null;
      this.getReservations(this.restaurant_id, this.odate.value);
     });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }
 /*  filterCustomerName(id){
    var cust = this.customers.filter(x => x.id === id)
    //console.log('cust',cust,cust[0].name)
    return cust[0].name;
  } */

  filterCustomer(id){
    var cust = this.customers.filter(x => x.id === id)
    //console.log('cust',cust,cust[0].name)
    if (cust.length === 0){

      return new Customer();
    }
    else{
      return cust[0];
    }
    
  }

  filterTable(id){
    var table = this.tables.filter(x => x.id === id)
    //console.log('table',table)
    if (table.length === 0){
      
      return new Table();
    }
    else{
      return table[0];
    }
   
  }

 /*  filterTablesName(id){
    var table = this.tables.filter(x => x.id === id)
    //console.log('cust',cust,cust[0].name)
    return table[0].table_name;
  } */

  getReservations(id, date){
    //this.authenticationService.getRestuarantID()
    this.reservationsService.getReservations(id, date)
    .subscribe(occupy => {this.occupy = occupy;
      if(occupy.length !== 0){
       var table_ids = this.occupy.map(x => x.table_id);
      this.getTableBatch(table_ids) 
      var customer_ids = this.occupy.map(x => x.customer_id);
      this.getCustomerBatch(customer_ids) 
    }
    });
  }

  getCustomerBatch(customerid){
    //this.authenticationService.getRestuarantID()
    this.customerService.getCustomerBatch(customerid)
    .subscribe(customerid => {this.customers = customerid
    }
      );
  }

  getTableBatch(Tableid){
    //this.authenticationService.getRestuarantID()
    this.tablesService.getTableBatch(Tableid)
    .subscribe(table => this.tables = table);
  }

  deleteReservation(occupy: Occupy){
    //this.authenticationService.getRestuarantID()
    this.reservationsService.deleteReservation(occupy)
    .subscribe();
    this.occupy = this.occupy.filter(o => o !== occupy);
  }

  UpdateStatus(occupy: Occupy){
    if(occupy.status){
      occupy.status = 0;
    } else {
      occupy.status = 1;
    }
    this.reservationsService.updateReservation(occupy)
    .subscribe(
      //occupy => {console.log('status updated')}
      );
    
  }
 
  getDate(){
    var today = new Date();
    return today
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    //this.events.push(`${type}: ${event.value}`);
   // console.log('event3', `${type}: ${event.value}`);
   // ${event.value}.setLocale('en-in');
   
  // console.log('event5',  moment(event.value).format('YYYY-MM-DD'));
   this.odate.setValue(moment(event.value).format('YYYY-MM-DD'));
   this.getReservations(this.restaurant_id,moment(event.value).format('YYYY-MM-DD'));
  }
  
}

/* 

@Component({
  selector: 'addDialog',
  templateUrl: 'addReserveDialog.html',
})

export class AddReserveDialog {

  @Input() reserveComponent: ReserveComponent;
  
  odate = new FormControl(new Date());

    dateFilter = (d: Date): boolean => {
     // console.log('date:',d, d.getDay(), new Date().getDate())
      const day = d.getDate();
      // Prevent Saturday and Sunday from being selected.
      return day >= new Date().getDate()// !== 0 && day !== 6;
    }

  addReserveForm: FormGroup;
  submitted = false;
  sections: Section[];
  floors: Floor[];
  tables: Table[];
  waiters: User[];
  occupy: Occupy[] = [];
  customer: Customer[] = [];
  selectedCustomer: Customer;
  customers: Observable<Customer[]>;
  tableSet = false;
  floorSet = false;
  sectionSet = false;
  guestsNum = 0;
  showError = false;
  private searchTerms = new Subject<string>();
 
 

  selectedSectionValue: Number;
  selectedfloorValue: Number;
  selectedtableValue: Number;
  selectedwaiterValue: Number;
  private exportTime = { hour: 7, minute: 15, meriden: 'PM', format: 24 };
  pickedTime: string; 
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private reservationsService: ReservationsService,
    private customerService: CustomerService,
    private sectionsService: SectionsService,
    private floorsService: FloorsService,
    private tablesService: TablesService,
    private usersService: UsersService,
    private authenticationService: AuthenticationService,
    private eventEmitterService: EventEmitterService,
    public dialogRef: MatDialogRef<AddReserveDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
    
    ngOnInit() {
      this.getFloors(this.authenticationService.getRestuarantID());
      this.getWaiters(this.authenticationService.getRestuarantID());
      this.createForm();
      this.pickedTime = this.exportTime.hour + ':' + this.exportTime.minute; 
      //this.addReserveForm.controls['time'].setValue(this.pickedTime)
     // this.addReserveForm.controls['date'].setValue(this.odate.value)

//initialize the search text change observable
      this.customers = this.searchTerms
        .debounceTime(300)        // wait 300ms after each keystroke before considering the term
        .distinctUntilChanged()   // ignore if next search term is same as previous
        .switchMap(term => term   // switch to new observable each time the term changes
            // return the http search observable
            ? this.customerService.search(term)
            // or the observable of empty heroes if there was no search term
            : Observable.of<Customer[]>([]))
        .catch(error => {
          // TODO: add real error handling
          console.log(error);
          return Observable.of<Customer[]>([]);
        });
      }
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  selectCustomer(customer: Customer): void {
    this.selectedCustomer = customer;
    this.customers = null;
    this.addReserveForm.controls['name'].setValue(this.selectedCustomer.name)
    console.log('customer:',this.selectedCustomer)
  }

  getFloors(id: number){
    this.floorsService.getFloors(id)
    .subscribe(floors => this.floors = floors);
  }
  getSections(id: number){
    this.sectionsService.getSections(id)
    .subscribe(sections => this.sections = sections);
    this.floorSet = true;
  }
  getTables(id: number){
    this.tablesService.getTables(id)
    .subscribe(tables => this.tables = tables);
    this.sectionSet = true;
  }
 
  setGuests(id: number){
    this.tableSet = true;
    this.guestsNum = this.tables[id].max_chairs
  }

  getWaiters(id: number){
    this.usersService.getWaiters(id)
    .subscribe(waiter => this.waiters = waiter);
  }

  openAddGDialog(): void {
    const dialogRef = this.dialog.open(AddGuestComponent, {
      width: '850px',
      data: {name: this.name}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.name = result;
    });
  }

  addReservation(value) {
  
    this.submitted = true;
    // stop here if form is invalid
    if (this.addReserveForm.invalid) {
      this.showError = true;
      return;
    }
    
  const id = 0;
  var customer_id = 0
  if (this.selectedCustomer != null){
  customer_id = this.selectedCustomer.id;
  }
  const table_id = this.tables[value.table].id;
  const type = 'reservation';
  const occupation_date = value.date//setValue(value.date).setNumberFormat('MM/dd/yyyy');
	const time = value.time;
	const status = '0';
	const guests_number= value.guestsNumber;
	const notes = value.notes;
	const duration= "" + value.duration;
	const waiter_id= value.waiter;
  const addDate= '';
  const customer_name= '';  
	const customer_phone = '';  
	const table_max_chairs = 0; 
  const table_number= 0; 
 
    const occupy: Occupy = { id, customer_id, table_id, type, occupation_date, time, status, guests_number, notes,duration,waiter_id,addDate, customer_name,customer_phone, table_max_chairs, table_number};
    if (!occupy) { return; }
    this.reservationsService.addReservation(occupy)
      .subscribe(occupy => {
        this.occupy.push(occupy);
      }, 
      error => { 
       console.log("error",error)
      })

     // this.reserveComponent.getReservations();
     this.reserveCompGetReservation();
     this.dialogRef.close();
        }
//call reserve component add reservation function
 reserveCompGetReservation(){    
          this.eventEmitterService.onGetReservationButtonClick();    
  }  

 // convenience getter for easy access to form fields
 get f() { return this.addReserveForm.controls; }

 createForm() {
   this.addReserveForm = this.fb.group({
     name: new FormControl("", [Validators.required]),
     lastname: new FormControl("", [Validators.required]),
     phone: new FormControl("", [Validators.required]),
     notes: new FormControl(""),
     floor: new FormControl("", [Validators.required] ),
     section: new FormControl("", [Validators.required]),
     table: new FormControl("", [Validators.required]),
     date: new FormControl("",  [Validators.required]),
     time: new FormControl("", [Validators.required]),
     duration: new FormControl(""),
     guestsNumber: new FormControl("", [Validators.required]),
     minimumSpent: new FormControl(""),
     waiter: new FormControl("", [Validators.required])
   });
 }
 
 get name() { return this.addReserveForm.get('name'); }
 get lastname() { return this.addReserveForm.get('lastname'); }
 get phone() { return this.addReserveForm.get('phone'); }
 get notes() { return this.addReserveForm.get('notes'); }
 get floor() { return this.addReserveForm.get('floor'); }
 get section() { return this.addReserveForm.get('section'); }
 get table() { return this.addReserveForm.get('table'); }
 get date() { return this.addReserveForm.get('date'); }
 get time() { return this.addReserveForm.get('time'); }
 get duration() { return this.addReserveForm.get('duration'); }
 get guestsNumber() { return this.addReserveForm.get('guestsNumber'); }
 get minimumSpent() { return this.addReserveForm.get('minimumSpent'); }
 get waiter() { return this.addReserveForm.get('waiter'); }
  

 onChangeHour(event) {
  //console.log('event', event.hour);
  this.pickedTime =  event.hour + ':' +  event.minute;
  this.addReserveForm.controls['time'].setValue(this.pickedTime)
 // console.log('event3', this.addReserveForm.get('time'));
 }

 addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
  //this.events.push(`${type}: ${event.value}`);
  console.log('event3', `${type}: ${event.value}`);
}

arrayOne(n: number): any[] {
  return Array(n);
}

} */




