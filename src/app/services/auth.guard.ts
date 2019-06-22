import { UsersService } from './users.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
//import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  

  constructor(
    private router: Router,
        private authenticationService: AuthenticationService
  ) {}


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    const isLoggedIn = this.authenticationService.isLoggedIn();
  
    if (currentUser && isLoggedIn) {
        // check if route is restricted by role
        /* if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
             // role not authorised so redirect to home page
            this.router.navigate(['/']);
            return false;
        } */

        // authorised so return true
        return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
}
  
   canActivateChild(): Promise<boolean> {
    return new Promise((resolve, reject) => {
     /*  //this.usersService.notifyUser('User can canActivateChild','top' ,'center')
      this.usersService.getCurrentUser(parseInt(this.cookieService.get('cookieUserId')))
      .then(user => {
        return resolve(true);
      }, err => {
        this.router.navigate(['/login']);
        return resolve(false);
      }) */
    })
  } 
}