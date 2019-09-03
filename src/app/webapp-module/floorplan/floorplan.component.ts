import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import * as moment from "moment";
import { Table } from 'src/app/structures/table';
import { TablesService } from 'src/app/services/tables.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Floor } from 'src/app/structures/floor';
import { FloorsService } from 'src/app/services/floors.service';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { filterQueryId } from '@angular/core/src/view/util';


@Component({
  selector: 'app-floorplan',
  templateUrl: './floorplan.component.html',
  styleUrls: ['./floorplan.component.css']
})
export class FloorplanComponent implements OnInit {

  odate = new FormControl(moment().format('YYYY-MM-DD'));
  tables: Table[];
  floors: Floor[];
  thresholdWidth: number;
  selectedFloor: Floor;
  imgURL = "rgb(200, 255, 255)"//"url('./assets/floors/grey.jpg')"
  restaurant_id: number;
  floorSelectForm: FormGroup;
  hover = false;
  isDisabled = true;
  floorStyle = {
    position: "relative",
    width: "0px", 
    height: "0px",
    background:"grey" 
   }
   updatedTables: Table[] = []
   @ViewChild('floorRoot')elementView: ElementRef;
   
  constructor(
    private authenticationService: AuthenticationService,
    private tablesService: TablesService,
    private floorService: FloorsService,
    private fb: FormBuilder,
    private router: Router,
    private data : DataService
  ) { }

  ngOnInit() {
    this.createForm();
    this.restaurant_id = this.authenticationService.getRestuarantID();
    this.floorService.getFloors(this.restaurant_id).subscribe(result => {this.floors = result;
      this.data.currentFloor.subscribe(res => {this.selectedFloor = res
      console.log(this.selectedFloor)
      if(!this.selectedFloor){this.selectedFloor =  this.floors[0];}
      this.floorSelectForm.controls['floor'].setValue(this.selectedFloor.id)
      this.thresholdWidth = (this.elementView.nativeElement).clientWidth
      this.floorStyle = {
        position: "relative",
        width: this.sizeMap(this.selectedFloor.width) + "px", 
        height: this.sizeMap(this.selectedFloor.height) + "px",
        background:"grey" 
       }
       this.tablesService.getTables(this.selectedFloor.id).subscribe(result => {this.tables = result;});
      })
    });
    //this.tablesService.getTables(this.restaurant_id);
  }
  openTableForm(type): void {
    this.data.changeFloor(this.selectedFloor);
    this.router.navigate(['webapp/floorplan/table', type]);
  }

  openTableEditForm(type, table): void {
    this.data.changeTable(table);
    this.router.navigate(['webapp/floorplan/table', type]);
  }

  saveChanges(): void {
    this.tablesService.editTableBatch(this.updatedTables).subscribe(t => {
      this.isDisabled = true;
      })
  }

  deleteTable(table): void {
    this.tablesService.deleteTable(table).subscribe(result => {
      //console.log(this.tables.filter(t => {t !== table}))
      this.tables = this.tables.filter(t => t !== table)
      console.log(this.tables)
    });
  }

  mouseEnter(div : string){
    //console.log("mouse enter : " + div);
    this.hover = true;
 }

 mouseLeave(div : string){
  //console.log('mouse leave :' + div);
  this.hover = false;
}
  onDragEnded(event, table) {
    let element = event.source.getRootElement();
    let parentElement = element.parentElement.getBoundingClientRect();
    //console.log(element.parentElement.getBoundingClientRect());
    //console.log(this.elementView)
    //console.log('parent:',this.elementView.nativeElement.offsetLeft, this.elementView.nativeElement.offsetTop)
     //console.log('element:', element)
    let boundingClientRect = element.getBoundingClientRect();
    //console.log('boundingClientRect:', boundingClientRect)
    //let parentPosition = this.getPosition(element);
    //console.log('parentPosition:', parentPosition)
    //console.log('x: ' + (boundingClientRect.x - parentPosition.left), 'y: ' + (boundingClientRect.y - parentPosition.top));
    let xPosition = boundingClientRect.x - parentElement.x;
    let yPosition = boundingClientRect.y - parentElement.y
    console.log('x: ' + (boundingClientRect.x - parentElement.x), 'y: ' + (boundingClientRect.y - parentElement.y));
    console.log('x: ' + (this.xPositionDragMap(xPosition)), 'y: ' + (this.yPositionDragMap(yPosition)));
    //table.xloc = this.xPositionDragMap(boundingClientRect.x - parentElement.x);
    //table.yloc = this.yPositionDragMap(boundingClientRect.y - parentElement.y);
    console.log('table after movement', table)
    let utable = Object.assign({}, table)
    utable.xloc = this.xPositionDragMap(xPosition)
    utable.yloc = this.yPositionDragMap(yPosition)
    console.log('utable after movement', utable)
    this.updatedTables = this.updatedTables.filter(t => t.id != utable.id)
    this.updatedTables.push(utable);
    this.isDisabled = false;
    console.log('update tables ', this.updatedTables)
    
  }
  
  /* getPosition(el) {
    let x = 0;
    let y = 0;
    let initx = el.offsetLeft;
    let inity = el.offsetTop;

    while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
     //console.log('el.offsetLeft:', el.offsetLeft)
    //console.log('el.offsetTop:', el.offsetTop )
    //console.log('el.scrollLeft:', el.scrollLeft )
      //console.log('el.scrollTop:', el.scrollTop )
      x += el.offsetLeft - el.scrollLeft;
      y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: y , left: x };
  } */

  xPositionDragMap(number){
    return number*100/this.sizeMap(this.selectedFloor.width)
  }
  xPositionMap(number){
    return number*this.sizeMap(this.selectedFloor.width)/100
  }

  yPositionDragMap(number){
    return number*100/this.sizeMap(this.selectedFloor.height)
  }

  yPositionMap(number){
    return number*this.sizeMap(this.selectedFloor.height)/100
  }

  sizeMap(number){
    return number*this.thresholdWidth/this.selectedFloor.width
  }
  selectFloor(value){
   this.selectedFloor =  this.floors.find(f => f.id === value)
  //console.log('selectedfloor:', this.selectedFloor)
  this.data.changeFloor(this.selectedFloor);
  this.tables = null
  this.floorStyle = {
    position: "relative",
    width: this.sizeMap(this.selectedFloor.width) + "px", 
    height: this.sizeMap(this.selectedFloor.height) + "px",
    background:"grey" 
   }
   this.tablesService.getTables(this.selectedFloor.id).subscribe(result => {this.tables = result;});
  }

  createForm() {
    this.floorSelectForm = this.fb.group({
      floor: new FormControl(""),
    });
  }
  get floor() { return this.floorSelectForm.get('floor'); }

}
