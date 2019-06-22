import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { tap } from 'rxjs/operators';
import { ErrorHandler } from './error_handler';
import { Router } from '@angular/router';



@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService,public errorHandler : ErrorHandler, private router: Router,) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.token) {
            //console.log("bearer header added:", currentUser.token)
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            });
        }
        //console.log("request:", request)
        return next.handle(request).pipe(
            tap((event: HttpEvent<any>) => {}, (err: any) => {
                console.log ('err:',err.error, ' err.status: ', err.status)
                if (err.status == 401 ){
                    this.errorHandler.handleTextError('Session Expired Please Log In Again');
                    this.router.navigate(['/login']);
                } else if (err.status == 404 ){
                    this.errorHandler.handleTextError('Page Not Found');
                    
                }else if (err instanceof HttpErrorResponse) {
                    console.log (err)
                  this.errorHandler.handleError(err);
                }
            })); 
    }
}