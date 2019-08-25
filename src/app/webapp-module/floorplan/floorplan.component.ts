import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import * as moment from "moment";
import { Table } from 'src/app/structures/table';
import { TablesService } from 'src/app/services/tables.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Floor } from 'src/app/structures/floor';
import { FloorsService } from 'src/app/services/floors.service';
import { CdkDragEnd } from '@angular/cdk/drag-drop';


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
  floorStyle = {
    position: "relative",
    width: "0px", 
    height: "0px",
    background:"grey" 
   }
  
   @ViewChild('floorRoot')elementView: ElementRef;
   
  constructor(
    private authenticationService: AuthenticationService,
    private tablesService: TablesService,
    private floorService: FloorsService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.createForm();
    this.restaurant_id = this.authenticationService.getRestuarantID();
    this.floorService.getFloors(this.restaurant_id).subscribe(result => {this.floors = result;
      this.selectedFloor =  this.floors[0];
      this.floorSelectForm.controls['floor'].setValue(this.selectedFloor.id)
      this.thresholdWidth = (this.elementView.nativeElement).clientWidth
      this.floorStyle = {
        position: "relative",
        width: this.sizeMap(this.selectedFloor.width) + "px", 
        height: this.sizeMap(this.selectedFloor.length) + "px",
        background:"grey" 
       }
       this.tablesService.getTables(this.selectedFloor.id).subscribe(result => {this.tables = result;});
    });
    //this.tablesService.getTables(this.restaurant_id);
  }

  onDragEnded(event) {
    let element = event.source.getRootElement();
    //console.log(this.elementView)
    //console.log('parent:',this.elementView.nativeElement.offsetLeft, this.elementView.nativeElement.offsetTop)
    //console.log('element:', element)
    let boundingClientRect = element.getBoundingClientRect();
    //console.log('boundingClientRect:', boundingClientRect)
    let parentPosition = this.getPosition(element);
    //console.log('parentPosition:', parentPosition)
    console.log('x: ' + (boundingClientRect.x - parentPosition.left), 'y: ' + (boundingClientRect.y - parentPosition.top));
  }
  
  getPosition(el) {
    let x = 0;
    let y = 0;
    let initx = el.offsetLeft;
    let inity = el.offsetTop;
    while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      x += el.offsetLeft - el.scrollLeft;
      y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: y-inity, left: x-initx };
  }

  sizeMap(number){
    return number*this.thresholdWidth/this.selectedFloor.width
  }
  selectFloor(value){
   this.selectedFloor =  this.floors.find(f => f.id === value)
  console.log('selectedfloor:', this.selectedFloor)
  this.floorStyle = {
    position: "relative",
    width: this.selectedFloor.width + "px", 
    height: this.selectedFloor.length + "px",
    background:"grey" 
   }
  }

  createForm() {
    this.floorSelectForm = this.fb.group({
      floor: new FormControl(""),
    });
  }
  get floor() { return this.floorSelectForm.get('floor'); }

}
