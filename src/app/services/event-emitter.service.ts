import { Injectable, EventEmitter } from '@angular/core';    
import { Subscription } from 'rxjs/internal/Subscription'; 

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  invokeGetReservationFunction = new EventEmitter();    
  subsVar: Subscription; 

  constructor() { }

  onGetReservationButtonClick() {    
    this.invokeGetReservationFunction.emit();    
  } 
}
