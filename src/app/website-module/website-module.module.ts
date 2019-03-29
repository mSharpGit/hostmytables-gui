import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebsiteModuleRoutingModule } from './website-module-routing.module';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ProductsComponent } from './products/products.component';
import { StoresComponent } from './stores/stores.component';

@NgModule({
  declarations: [HomeComponent, AboutComponent, ProductsComponent, StoresComponent],
  imports: [
    CommonModule,
    WebsiteModuleRoutingModule
  ]
})
export class WebsiteModuleModule { }
