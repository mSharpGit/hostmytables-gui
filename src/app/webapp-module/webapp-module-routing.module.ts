import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReserveComponent } from './reserve/reserve.component';
import { CustomerComponent } from './customer/customer.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { FloorplanComponent } from './floorplan/floorplan.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard',      component: DashboardComponent },
  { path: 'reserve',      component: ReserveComponent },
  { path: 'customer',      component: CustomerComponent },
  { path: 'floorplan',      component: FloorplanComponent },
  { path: 'customer/:type',      component: AddCustomerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebappModuleRoutingModule { }
