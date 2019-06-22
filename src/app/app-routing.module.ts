import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RootComponent } from './root/root.component';
import { WebappComponent } from './webapp-module/webapp/webapp.component';

const appRoutes: Routes = [
  { path: '',component: RootComponent, loadChildren: './website-module/website-module.module#WebsiteModuleModule'},
  { path: 'login', loadChildren: './login-module/login-module.module#LoginModuleModule'},
  { path: 'webapp', component: WebappComponent, loadChildren: './webapp-module/webapp-module.module#WebappModuleModule'},
  { path: '**',component: RootComponent, loadChildren: './website-module/website-module.module#WebsiteModuleModule'},
];

@NgModule({
  declarations: [],
  exports: [ RouterModule ],
  imports: [
    CommonModule,
    RouterModule.forRoot(
      appRoutes,
      //{ enableTracing: true } // <-- debugging purposes only
      )
  ]
})


export class AppRoutingModule { }
