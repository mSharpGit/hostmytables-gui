import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { WebappModuleRoutingModule } from './webapp-module-routing.module';
import { MaterialTimePickerModule } from '@candidosales/material-time-picker';

import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import {
  MatButtonModule,
  MatInputModule,
  MatIconModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSnackBarModule ,
  MatDialogModule ,
  MatRadioModule,
  MAT_DATE_FORMATS,
  MAT_NATIVE_DATE_FORMATS,
} from '@angular/material';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReserveComponent } from './reserve/reserve.component';
import { CustomerComponent } from './customer/customer.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { FloorplanComponent } from './floorplan/floorplan.component';
@NgModule({
  declarations: [DashboardComponent, ReserveComponent, CustomerComponent, AddCustomerComponent, FloorplanComponent],
  entryComponents: [],
  imports: [
    MaterialTimePickerModule,
    CommonModule,
    WebappModuleRoutingModule,
    MatButtonModule,
    MatInputModule,
    MatRippleModule,
    MatIconModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatDialogModule ,
    ReactiveFormsModule,
    FormsModule,
    MatRadioModule,
    DragDropModule
  ]
})
export class WebappModuleModule { }
