import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker/typings/datepicker-input';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Occupy } from 'src/app/structures/occupy';
import { AddGuestComponent } from '../add-guest/add-guest.component';
import { Customer } from 'src/app/structures/customer';
import { Observable } from 'rxjs/Observable';
import { Section } from 'src/app/structures/section';
import { Floor } from 'src/app/structures/floor';
import { Table } from 'src/app/structures/table';
import { User } from 'src/app/structures/user';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ReservationsService } from 'src/app/services/reservations.service';
import { CustomerService } from 'src/app/services/customer.service';
import { SectionsService } from 'src/app/services/sections.service';
import { FloorsService } from 'src/app/services/floors.service';
import { TablesService } from 'src/app/services/tables.service';
import { UsersService } from 'src/app/services/users.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { title, code, AddReserveDialogData } from 'src/app/structures/interfaces';
import { Globals } from 'src/app/structures/globals';
import * as moment from "moment";
@Component({
  selector: 'app-add-reservation',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.css']
})
export class AddReservationComponent implements OnInit {

  //odate = new FormControl(new Date());
  odate: FormControl;
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
  titles: title[];
  codes: code[];
  onCloseAddReserve = new EventEmitter();
  ADD = false;

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
    public dialogRef: MatDialogRef<AddReservationComponent>,
    private globals: Globals,
    @Inject(MAT_DIALOG_DATA) public data: AddReserveDialogData) {

  }

  ngOnInit() {
    if (this.data.type == 'ADD') {
    this.ADD = true;
      this.odate = new FormControl(moment(this.data.date).format('YYYY-MM-DD'));
    } else {
      //this.odate = new FormControl(moment(this.data.occupy.occupation_date).format('YYYY-MM-DD'));
      this.odate = new FormControl(moment(this.data.occupy.occupation_date).format('YYYY-MM-DD'));
      this.selectedCustomer = this.data.customer;
    }
    this.titles = this.globals.titles;
    this.codes = this.globals.codes;
    this.getFloors(this.authenticationService.getRestuarantID());
    this.getWaiters(this.authenticationService.getRestuarantID());
    this.createForm();
    this.addReserveForm.controls['date'].setValue(this.odate);
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
    this.addReserveForm.controls['name'].setValue(this.selectedCustomer.name);
    this.addReserveForm.controls['lastname'].setValue(this.selectedCustomer.lastname);
    this.addReserveForm.controls['phone'].setValue(this.selectedCustomer.phone);
    //console.log('customer:', this.selectedCustomer)
  }

  getFloors(id: number) {
    this.floorsService.getFloors(id)
      .subscribe(floors => this.floors = floors);
  }
  getSections(id: number) {
    this.sectionsService.getSections(id)
      .subscribe(sections => this.sections = sections);
    this.floorSet = true;
  }
  getTables(id: number) {
    this.tablesService.getTables(id)
      .subscribe(tables => this.tables = tables);
    this.sectionSet = true;
  }

  setGuests(id: number) {
    this.tableSet = true;
    this.guestsNum = this.tables[id].max_chairs
  }

  getWaiters(id: number) {
    this.usersService.getWaiters(id)
      .subscribe(waiter => this.waiters = waiter);
  }

  openAddGDialog(): void {
    const dialogRef = this.dialog.open(AddGuestComponent, {
      width: '850px',
      data: { //title: this.addReserveForm.controls.title.value,
        name: this.addReserveForm.controls.name.value,
        lastname: this.addReserveForm.controls.lastname.value,
        code: this.addReserveForm.controls.code.value,
        phone: this.addReserveForm.controls.phone.value
      }
    });

    const sub = dialogRef.componentInstance.onClose.subscribe((data) => {
      console.log('Dialog closing data', data.id);
      this.selectedCustomer = data;
      this.addReserveForm.controls['name'].setValue(data.name);
      this.addReserveForm.controls['lastname'].setValue(data.lastname);
      this.addReserveForm.controls['phone'].setValue(data.phone);

    });

    dialogRef.afterClosed().subscribe(result => {

      console.log('The dialog was closed');
      //this.name = result;
    });
  }

  editReservation(value) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addReserveForm.invalid) {
      this.showError = true;
      return;
    }

    const id = 0;
    var restaurant_id = this.authenticationService.getRestuarantID();
    var customer_id = 0
    if (this.selectedCustomer != null) {
      customer_id = this.selectedCustomer.id;
    }
    const table_id = value.table;
    /* var table_id = 0
    if (this.tables != null) {
       table_id = this.tables[value.table].id;
      } */
    const type = 'reservation';
    const occupation_date = moment(value.date).format('YYYY-MM-DD')//setValue(value.date).setNumberFormat('MM/dd/yyyy');
    const time = value.time;
    const status = '0';

    const guests_number = value.guestsNumber;
    /* var guests_number = 0
    if (value.guestsNumber != null) {
      guests_number = value.guestsNumber;
      }
 */
    const notes = value.notes;
    const duration = "" + value.duration;
    const minimum_spent = "" + value.minimumSpent;
    console.log('waiter',value.waiter)
    const waiter_id = value.waiter;
    //const waiter_id = value.waiter;
    /*  var waiter_id = 0
    if (value.waiter != null) {
      waiter_id = value.waiter;
      } */
    const add_date = '';
    /*  const customer_name = '';
     const customer_phone = '';
     const table_max_chairs = 0;
     const table_number = 0; */

    const occupy: Occupy = { id, restaurant_id, customer_id, table_id, type, occupation_date, time, status, guests_number, notes, duration, minimum_spent, waiter_id, add_date };
    if (!occupy) { return; }
    this.reservationsService.addReservation(occupy)
      .subscribe(occupy => {
        this.occupy.push(occupy);
        this.onCloseAddReserve.emit(this.occupy);
      },
        error => {
          console.log("error", error)
        })
    this.dialogRef.close();

  }
  addReservation(value) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addReserveForm.invalid) {
      this.showError = true;
      return;
    }

    const id = 0;
    var restaurant_id = this.authenticationService.getRestuarantID();
    var customer_id = 0
    if (this.selectedCustomer != null) {
      customer_id = this.selectedCustomer.id;
    }
    const table_id = value.table;
   /*  var table_id = 0
    if (this.tables != null) {
       table_id = this.tables[value.table].id;
      } else {table_id = 0} */
    const type = 'reservation';
    const occupation_date = moment(value.date).format('YYYY-MM-DD')//setValue(value.date).setNumberFormat('MM/dd/yyyy');
    const time = value.time;
    const status = '0';
    const guests_number = value.guestsNumber;
    /* var guests_number = 0;
    if (value.guestsNumber != null) {
      guests_number = value.guestsNumber;
      } */
    const notes = value.notes;
    const duration = "" + value.duration;
    const minimum_spent = "" + value.minimumSpent;
    const waiter_id = value.waiter;
    /* var waiter_id = 0
    if (value.waiter != null) {
      waiter_id = value.waiter;
      } else {waiter_id = 0} */
    const add_date = '';
    /*  const customer_name = '';
     const customer_phone = '';
     const table_max_chairs = 0;
     const table_number = 0; */

    const occupy: Occupy = { id, restaurant_id, customer_id, table_id, type, occupation_date, time, status, guests_number, notes, duration, minimum_spent, waiter_id, add_date };
    if (!occupy) { return; }
    this.reservationsService.addReservation(occupy)
      .subscribe(occupy => {
        this.occupy.push(occupy);
        this.onCloseAddReserve.emit(this.occupy);
      },
        error => {
          console.log("error", error)
        })
    this.dialogRef.close();
  }

  getErrors(ctrl) {
    return Object.keys(ctrl.errors);
  }

  // convenience getter for easy access to form fields
  get f() { return this.addReserveForm.controls; }

  createForm() {
    if (this.ADD) {
      this.addReserveForm = this.fb.group({
        name: new FormControl("", [Validators.required]),
        lastname: new FormControl("", [Validators.required]),
        code: new FormControl(""),
        phone: new FormControl("", [Validators.required]),
        notes: new FormControl(""),
        floor: new FormControl(0),
        section: new FormControl(0),
        table: new FormControl(null),
        date: new FormControl(this.odate),
        time: new FormControl(""),
        duration: new FormControl(""),
        guestsNumber: new FormControl(0),
        minimumSpent: new FormControl(""),
        waiter: new FormControl(0)
      });
    } else {
      this.addReserveForm = this.fb.group({
        name: new FormControl(this.data.customer.name, [Validators.required]),
        lastname: new FormControl(this.data.customer.lastname, [Validators.required]),
        code: new FormControl(""),
        phone: new FormControl(this.data.customer.phone, [Validators.required]),
        notes: new FormControl(""),
        floor: new FormControl(0),
        section: new FormControl(0),
        table: new FormControl(null),
        date: new FormControl(this.odate),
        time: new FormControl(""),
        duration: new FormControl(""),
        guestsNumber: new FormControl(0),
        minimumSpent: new FormControl(""),
        waiter: new FormControl(0)
      });
    }
  }

  get name() { return this.addReserveForm.get('name'); }
  get lastname() { return this.addReserveForm.get('lastname'); }
  get code() { return this.addReserveForm.get('code'); }
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
    this.pickedTime = event.hour + ':' + event.minute;
    this.addReserveForm.controls['time'].setValue(this.pickedTime)
    // console.log('event3', this.addReserveForm.get('time'));
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    //this.events.push(`${type}: ${event.value}`);
    //console.log('event3', `${type}: ${event.value}`);
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

}