import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebappComponent } from './webapp/webapp.component';

const routes: Routes = [
  { path: '', component: WebappComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebappModuleRoutingModule { }
