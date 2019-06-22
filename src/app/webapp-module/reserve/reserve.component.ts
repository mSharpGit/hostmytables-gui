import { Component, OnInit, Inject, Input, HostBinding } from '@angular/core';
import { ReservationsService } from 'src/app/services/reservations.service';
import { SectionsService } from 'src/app/services/sections.service';
import { Occupy } from 'src/app/structures/occupy';
import { TablesService } from 'src/app/services/tables.service';
import { Table } from 'src/app/structures/table';
import { AuthenticationService } from 'src/app/services/authentication.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Section } from 'src/app/structures/section';
import { Floor } from 'src/app/structures/floor';
import { FloorsService } from 'src/app/services/floors.service';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/structures/user';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { EventEmitterService } from 'src/app/services/event-emitter.service';


export interface DialogData {
  name: string;
  notes: string;
  section: number;
  minimunSpent: number;
  waiter: number;
  Date: Date;
  duration: string;
  guestsNumber: number;
  table: number;
}



@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.css']
})
export class ReserveComponent implements OnInit {

  @HostBinding('class.is-open')
  
  occupy: Occupy[];
  table: Table;

  animal: string;
  name: string;

  

  constructor(private reservationsService: ReservationsService,
    private authenticationService: AuthenticationService,
    private eventEmitterService: EventEmitterService,
    private tablesService: TablesService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.getReservations();

    if (this.eventEmitterService.subsVar==undefined) {    
      this.eventEmitterService.subsVar = this.eventEmitterService.invokeGetReservationFunction.subscribe((name:string) => {    
        this.getReservations();    
      });    
    } 
  }


  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddReserveDialog, {
      width: '850px',
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  getReservations(){
    //this.authenticationService.getRestuarantID()
    this.reservationsService.getReservations(this.authenticationService.getRestuarantID())
    .subscribe(occupy => this.occupy = occupy);
  }

  deleteReservation(occupy: Occupy){
    //this.authenticationService.getRestuarantID()
    this.reservationsService.deleteReservation(occupy)
    .subscribe();
    this.occupy = this.occupy.filter(o => o !== occupy);
  }

 
  getDate(){
    var today = new Date();
    return today
  }

  
}



@Component({
  selector: 'addDialog',
  templateUrl: 'addReserveDialog.html',
})

export class AddReserveDialog {

  @Input() reserveComponent: ReserveComponent;
  
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

  selectedSectionValue: Number;
  selectedfloorValue: Number;
  selectedtableValue: Number;
  selectedwaiterValue: Number;
  private exportTime = { hour: 7, minute: 15, meriden: 'PM', format: 12 };
  constructor(
    private fb: FormBuilder,
    private reservationsService: ReservationsService,
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
      }
  onNoClick(): void {
    this.dialogRef.close();
  }

  getFloors(id: number){
    this.floorsService.getFloors(id)
    .subscribe(floors => this.floors = floors);
  }
  getSections(id: number){
    this.sectionsService.getSections(id)
    .subscribe(sections => this.sections = sections);
  }
  getTables(id: number){
    this.tablesService.getTables(id)
    .subscribe(tables => this.tables = tables);
  }
  getWaiters(id: number){
    this.usersService.getWaiters(id)
    .subscribe(waiter => this.waiters = waiter);
  }
  addReservation(value) {
  
    this.submitted = true;
    // stop here if form is invalid
    if (this.addReserveForm.invalid) {
      return;
    }
    
  const id = 0;
  const customer_id = 1;
  const table_id = value.table;
  const type = 'reservation';
  const occupation_date = ''//setValue(value.date).setNumberFormat('MM/dd/yyyy');
	const time = '07:00';
	const status = '0';
	const guests_number= 2;
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
        }
//call reserve component add reservation function
 reserveCompGetReservation(){    
          this.eventEmitterService.onGetReservationButtonClick();    
  }  

 // convenience getter for easy access to form fields
 get f() { return this.addReserveForm.controls; }

 createForm() {
   this.addReserveForm = this.fb.group({
     name: new FormControl(""),
     notes: new FormControl(""),
     floor: new FormControl("",  Validators.required ),
     section: new FormControl("",  [Validators.required]),
     table: new FormControl("", [Validators.required]),
     date: new FormControl("",  [Validators.required]),
     duration: new FormControl(""),
     guestsnumber: new FormControl("", [Validators.required] ),
     minimumspent: new FormControl(""),
     waiter: new FormControl("", [Validators.required])
   });
 }
 
 get name() { return this.addReserveForm.get('name'); }
 get notes() { return this.addReserveForm.get('notes'); }
 get floor() { return this.addReserveForm.get('floor'); }
 get section() { return this.addReserveForm.get('section'); }
 get table() { return this.addReserveForm.get('table'); }
 get date() { return this.addReserveForm.get('date'); }
 get duration() { return this.addReserveForm.get('duration'); }
 get guestsnumber() { return this.addReserveForm.get('guestsnumber'); }
 get minimumspent() { return this.addReserveForm.get('minimumspent'); }
 get waiter() { return this.addReserveForm.get('waiter'); }
  

 onChangeHour(event) {
  console.log('event', event);
}

}