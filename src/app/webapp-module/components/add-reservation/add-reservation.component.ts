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
  sectionv: Section;
  floors: Floor[];
  floorv: Floor;
  tables: Table[];
  filteredTable: Table;
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
  private exportTime = { hour: 5, minute: 0, meriden: 'PM', format: 12 };
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
    if (this.data.type == 'EDIT') {
       //this.odate = new FormControl(moment(this.data.occupy.occupation_date).format('YYYY-MM-DD'));
       this.odate = new FormControl(moment(this.data.occupy.occupation_date).format('YYYY-MM-DD'));
       this.selectedCustomer = this.data.customer;
      /*  this.sectionsService.getSection(this.data.table.section_id)
       .subscribe(section => {this.sectionv = section
         
         this.floorsService.getFloor(section.floor_id)
         .subscribe(floor => {this.floorv = floor;
           this.sectionSet = true;
           this.floorSet = true;
           this.tableSet = true;});
         
       }); */
    } else {
     
    this.ADD = true;
    this.odate = new FormControl(moment(this.data.date).format('YYYY-MM-DD'));
    }
    this.createForm();
    this.titles = this.globals.titles;
    this.codes = this.globals.codes;
    this.getFloors(this.authenticationService.getRestuarantID());
    this.getWaiters(this.authenticationService.getRestuarantID());
   
    //console.log(this.odate.value, ':',new Date());
    this.addReserveForm.controls['date'].setValue(this.odate.value);
    
    this.pickedTime = String(this.exportTime.hour).padStart(2, '0') + ':' + String(this.exportTime.minute).padStart(2, '0')  + ' ' + this.exportTime.meriden;
    //console.log('time',this.pickedTime)
    this.addReserveForm.controls['time'].setValue(this.pickedTime)
    if (this.floorv) {this.addReserveForm.controls['floor'].setValue(this.floorv.id)}
    if (this.sectionv) {this.addReserveForm.controls['section'].setValue(this.sectionv.id)}

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
    if(id){
    this.sectionsService.getSections(id)
      .subscribe(sections => {this.sections = sections
        this.floorSet = true;});
      } 
  }
  getTables(id: number) {
    if(id){
    this.tablesService.getTables(id)
      .subscribe(tables => {this.tables = tables
        this.sectionSet = true;});
      }
  }

  setGuests(id: number) {
    if(id){
    this.tableSet = true;
    this.filteredTable = this.tables.filter(x => x.id === id)[0];
    this.guestsNum = this.filteredTable.max_chairs
    
    }
  }

  getWaiters(id: number) {
    this.usersService.getWaiters(id)
      .subscribe(waiter => this.waiters = waiter);
  }

  openAddGDialog(): void {
    var dialogCustomer = new Customer();
    dialogCustomer.name = this.addReserveForm.controls.name.value;
    dialogCustomer.lastname = this.addReserveForm.controls.lastname.value;
    dialogCustomer.phone = this.addReserveForm.controls.phone.value;
    const dialogRef = this.dialog.open(AddGuestComponent, {
      width: '850px',
      data: { 
        customer: dialogCustomer,
        type: 'ADD'
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

    const id = this.data.occupy.id;
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
    var status = 1
    if(this.data.type === 'RESERVE'){ status = 0;}

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
    this.reservationsService.editReservation(occupy)
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
    const type = this.data.type;
    const occupation_date = moment(value.date).format('YYYY-MM-DD')//setValue(value.date).setNumberFormat('MM/dd/yyyy');
    const time = value.time;
    var status = 1
    if(this.data.type === 'RESERVE'){ status = 0;}
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
        notes: new FormControl(this.data.occupy.notes),
        floor: new FormControl(),
        section: new FormControl(),
        table: new FormControl(this.data.table.table_name),
        date: new FormControl(this.odate),
        time: new FormControl(this.data.occupy.time),
        duration: new FormControl(this.data.occupy.duration),
        guestsNumber: new FormControl(this.data.occupy.guests_number),
        minimumSpent: new FormControl(this.data.occupy.minimum_spent),
        waiter: new FormControl(this.data.occupy.waiter_id)
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
    console.log('event', event.hour);
    this.pickedTime = String(event.hour).padStart(2, '0') + ':' + String(event.minute).padStart(2, '0') + ' ' + event.meriden;
    
     this.exportTime = { hour: event.hour, minute: event.minute, meriden: event.meriden, format: 12 };
    this.addReserveForm.controls['time'].setValue(this.pickedTime)
    //console.log('event3', this.addReserveForm.get('time'));
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    //this.events.push(`${type}: ${event.value}`);
    //console.log('event3', `${type}: ${event.value}`);
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

}