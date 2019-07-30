import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  MAT_DATE_FORMATS,
  MAT_NATIVE_DATE_FORMATS,
} from '@angular/material';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReserveComponent } from './reserve/reserve.component';
@NgModule({
  declarations: [DashboardComponent, ReserveComponent],
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
  ]
})
export class WebappModuleModule { }
