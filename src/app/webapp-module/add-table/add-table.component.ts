import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Table } from 'src/app/structures/table';
import { shape } from 'src/app/structures/interfaces';
import { Globals } from 'src/app/structures/globals';
import * as moment from "moment";
import { getTypeNameForDebugging } from '@angular/core/src/change_detection/differs/iterable_differs';
import { Floor } from 'src/app/structures/floor';
import { TablesService } from 'src/app/services/tables.service';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-add-table',
  templateUrl: './add-table.component.html',
  styleUrls: ['./add-table.component.css']
})
export class AddTableComponent implements OnInit {

  floor: Floor;
  addTableForm: FormGroup;
  type: string;
  submitted = false;
  showError = false;
  ADD = false;
  table: Table;
  shapes : Array<shape>;
  sdate: FormControl;
  edate: FormControl;

  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private globals: Globals,
    private tablesService: TablesService,
    private data: DataService,) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.type = params['type'];
      // In a real app: dispatch action to load the details here.
    });
    if (this.type === 'Add') {
      this.table = new Table;
      this.ADD = true;
      this.createForm();
      this.shapes = this.globals.shapes;
      this.data.currentFloor.subscribe(floor => this.floor = floor)
      if (!this.floor) {
        this.router.navigate(['webapp/floorplan']);
      } 
      this.f['shape'].setValue('Square')
    this.f['diameter'].disable();
    this.sdate = new FormControl(moment().format('YYYY-MM-DD'));
    this.edate = new FormControl(moment().format('YYYY-MM-DD'));
    } else {
      this.data.currentTable.subscribe(t => this.table = t)
      if (!this.table) {
        this.router.navigate(['webapp/floorplan']);
      } else {
        this.createForm();
        this.shapes = this.globals.shapes;
        this.f['shape'].setValue(this.table.shape);
        if(this.table.shape === 'Round'){
          this.f['height'].disable();
          this.f['width'].disable();
        }else{
            this.f['diameter'].disable();
          }
        
        //this.f['startdate'].setValue(moment(this.table.start_date).format('YYYY-MM-DD'))
        //this.f['enddate'].setValue(moment(this.table.end_date).format('YYYY-MM-DD'))
        this.sdate = new FormControl(moment(this.table.start_date).format('YYYY-MM-DD'));
        this.edate = new FormControl(moment(this.table.end_date).format('YYYY-MM-DD'));
      }
    }

    
  }

  editTable(value) {
    console.log(value)
    this.submitted = true;
    // stop here if form is invalid
    if (this.addTableForm.invalid) {
      this.showError = true;
      return;
    }

    
    const id = this.table.id;
    const floor_id = this.table.floor_id;
    const table_number = Number(value.number);
    const table_name = value.name;
    const shape = value.shape;
    const width = Number(value.width);
    const height = Number(value.height);
    const diameter = Number(value.diameter);
    const xloc = Number(value.xloc);
    const yloc = Number(value.yloc);
    const start_date = value.startdate;
    const end_date = value.enddate;
    const max_chairs = Number(value.maxchairs);
    const min_chairs = Number(value.minchairs);
    const add_date = '';


  
    const table: Table = { id, floor_id, table_number, table_name, shape, width, height, diameter, xloc, yloc, min_chairs, max_chairs, start_date, end_date, add_date };
    
    if (!table) { return; }
    this.tablesService.editTable(table)
      .subscribe(table => {
        this.table = table;
        //this.router.navigate(['webapp/floorplan']);
        this.cancel();
      });
  }

  addTable(value) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addTableForm.invalid) {
      this.showError = true;
      return;
    }

    console.log('value',value)
    const id = 0;
    const floor_id = this.floor.id;
    const table_number = Number(value.number);
    const table_name = value.name;
    const shape = value.shape;
    const width = Number(value.width);
    const height = Number(value.height);
    const diameter = Number(value.diameter);
    const xloc = Number(value.xloc);
    const yloc = Number(value.yloc);
    const start_date = value.startdate;
    const end_date = value.enddate;
    const max_chairs = Number(value.maxchairs);
    const min_chairs = Number(value.minchairs);
    const add_date = '';


  
    const table: Table = { id, floor_id, table_number, table_name, shape, width, height, diameter, xloc, yloc, min_chairs, max_chairs, start_date, end_date, add_date };
   //console.log('table',table)
    if (!table) { return; }
    this.tablesService.addTable(table)
      .subscribe(table => {
        this.table = table;
       // this.router.navigate(['webapp/floorplan']);
       this.cancel();
      });
  }

  selectShape(value){
    
    if(value === 'Round'){
    this.f['diameter'].enable();
    this.f['width'].disable();
    this.f['height'].disable();
  }else{
    this.f['width'].enable();
    this.f['height'].enable();
    this.f['diameter'].disable();
  }
   }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  get f() { return this.addTableForm.controls; }

  createForm() {
    this.addTableForm = this.fb.group({
      name:new FormControl(this.table.table_name),
      number: new FormControl(this.table.table_number),
      shape: new FormControl(""),
      xloc: new FormControl(this.table.xloc),
      yloc: new FormControl(this.table.yloc),
      diameter: new FormControl(this.table.diameter),
      width: new FormControl(this.table.width),
      height: new FormControl(this.table.height),
      startdate: new FormControl(this.table.start_date),
      enddate: new FormControl(this.table.end_date),
      maxchairs: new FormControl(this.table.max_chairs),
      minchairs: new FormControl(this.table.min_chairs),
    });
  }
  get name() { return this.addTableForm.get('name'); }
  get number() { return this.addTableForm.get('number');}
  get shape() { return this.addTableForm.get('shape'); } 
  get xloc() { return this.addTableForm.get('xloc'); } 
  get yloc() { return this.addTableForm.get('yloc'); } 
  get diameter() { return this.addTableForm.get('diameter'); } 
  get width() { return this.addTableForm.get('width'); } 
  get height() { return this.addTableForm.get('height'); } 
  get startdate() { return this.addTableForm.get('startdate'); } 
  get enddate() { return this.addTableForm.get('enddate'); } 
  get maxchairs() { return this.addTableForm.get('maxchairs'); } 
  get minchairs() { return this.addTableForm.get('minchairs'); } 
  

}
