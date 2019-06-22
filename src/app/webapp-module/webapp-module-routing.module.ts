import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReserveComponent } from './reserve/reserve.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard',      component: DashboardComponent },
  { path: 'reserve',      component: ReserveComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebappModuleRoutingModule { }
