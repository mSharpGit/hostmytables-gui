import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebappModuleRoutingModule } from './webapp-module-routing.module';
import { WebappComponent } from './webapp/webapp.component';

@NgModule({
  declarations: [WebappComponent],
  imports: [
    CommonModule,
    WebappModuleRoutingModule
  ]
})
export class WebappModuleModule { }
