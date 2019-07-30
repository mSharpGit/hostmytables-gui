import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialTimePickerModule } from '@candidosales/material-time-picker';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AddGuestComponent } from './add-guest/add-guest.component';
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
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { AddReservationComponent } from './add-reservation/add-reservation.component';


  
@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    MaterialTimePickerModule,
    CommonModule,
    RouterModule,
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
    FormsModule   ,
    MatRadioModule,
    ReactiveFormsModule   
  ],
  entryComponents: [AddGuestComponent, AddReservationComponent ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    AddGuestComponent,
    AddReservationComponent  
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent
  ]
})
export class ComponentsModule { }
