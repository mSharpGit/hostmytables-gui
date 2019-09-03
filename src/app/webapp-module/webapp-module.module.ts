import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { WebappModuleRoutingModule } from './webapp-module-routing.module';
import { MaterialTimePickerModule } from '@candidosales/material-time-picker';
import { TableComponent } from './components/table/table.component';

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
import { AddTableComponent } from './add-table/add-table.component';
import { AddReservationComponent } from './add-reservation/add-reservation.component';
@NgModule({
  declarations: [DashboardComponent, ReserveComponent, CustomerComponent, AddCustomerComponent, FloorplanComponent, TableComponent, AddTableComponent, AddReservationComponent],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
  ],
  exports: [TableComponent]
})
export class WebappModuleModule { }
