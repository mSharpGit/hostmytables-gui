import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { AppComponent } from './app.component';
import { WebappComponent } from './webapp-module/webapp/webapp.component';
import 'hammerjs';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { RootComponent } from './root/root.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentsModule } from './webapp-module/components/components.module';
import { MaterialTimePickerModule } from '@candidosales/material-time-picker';
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
  MAT_DATE_FORMATS,
  MAT_NATIVE_DATE_FORMATS,
} from '@angular/material';
import { AuthGuard } from './services/auth.guard';
import { JwtInterceptor } from './services/jwt.interceptor';
import { ErrorHandler } from './services/error_handler';
import { EventEmitterService } from './services/event-emitter.service';
@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    RootComponent,
    WebappComponent,
    NotificationsComponent
  ],
  imports: [
    MaterialTimePickerModule,
    ComponentsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
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
  ReactiveFormsModule,
  FormsModule,
  HttpClientModule,
  ],
  providers: [AuthGuard ,ErrorHandler,
    NotificationsComponent,
    EventEmitterService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true, }
    , {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS}],
  bootstrap: [AppComponent]
})
export class AppModule { }
