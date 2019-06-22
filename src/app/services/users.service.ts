import { Injectable } from '@angular/core';
import { User } from '../structures/user';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { NotificationsComponent } from '../notifications/notifications.component';
import {Router} from '@angular/router';
import { environment } from 'src/environments/environment';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};



@Injectable({
  providedIn: 'root'
})
export class UsersService {

  //private url = 'http://localhost:8080';
  //private url = 'https://www.m-sharp.com';
  private url = environment.apiUrl;
  private apiUrl = this.url + '/user';
  private valUrl = this.url + '/valuser';
  private authUrl = this.url + '/authuser';
  private resetUrl = this.url + '/resetuser';
  private restuarantUserUrl = this.url + '/user/restaurant/';
  cookieValue = 'UNKNOWN';

  getWaiters(id: number): Observable<User[]> {
    const url = this.restuarantUserUrl+"/"+id;
    return this.http.get<User[]>(url).pipe(
      tap(user => console.log(`fetched waiters restuarant`, user))
    );
  }

  checkCookies(): Promise<boolean>{
    return new Promise((resolve, reject) => {
    /*   this.cookieService.get('username')
      .then(user => {
        return resolve(true);
      }, err => {
        this.router.navigate(['/login']);
        return resolve(false);
      }) */
    })
  }

  getCurrentUser(id: number){
    
    /* return this.http.post<User>(this.apiUrl+"/"+id, httpOptions).pipe(
      tap((user: User) => {this.notifyUser(`Please check your email address to activate your user`, 'top',"center")
     
      this.router.navigate(['/portal/'+user.id]);
    }
      //catchError(this.handleError<User>('addUser'))
      )); */

   /*  return new Promise<any>((resolve, reject) => {
    
      var user = this.http.get<User>(this.apiUrl+"/"+id, httpOptions).pipe(
        tap((user: User) => {//this.notifyUser(`Congratulations! Please check your email address to activate your user`)
        
        resolve(user) 
       // this.router.navigate(['/portal/'+user.id]);
      },() => {
        reject('No user logged in')}//catchError(this.handleError<User>('addUser'))
        )); 
        }) 
         */
        

        return new Promise((resolve, reject) => {
          
          this.http.get<User>(this.apiUrl+"/"+id, httpOptions)
            .toPromise()
            .then(
              res => { // Success
                resolve();
              }
            );
        });

       /*  (function(user){
        if (user) {
          resolve(user);
        } else {
          reject('No user logged in');
        }
      })*/
    
  }

  addUser (user: User): Observable<User> {
    
    /* return this.http.post<User>(this.apiUrl, user, httpOptions).pipe(
      tap((user: User) => console.log(`added user w/ id=${user.id}`)),
      catchError(this.handleError<User>('addUser'))
    ); */
    return this.http.post<User>(this.apiUrl, user, httpOptions).pipe(
      tap((user: User) => {this.notifyUser(`Please check your email address to activate your user`, 'top',"center")
      this.router.navigate(['/login']);
    }
      //catchError(this.handleError<User>('addUser'))
      ));
  }

  resetUser (user: User): Observable<User> {
    return this.http.post<User>(this.resetUrl, user, httpOptions).pipe(
      tap((user: User) => {this.notifyUser(`Please check your email address to reset your password`, 'top',"center")
      //this.router.navigate(['/portal']);
    }//catchError(this.handleError<User>('addUser'))
      ));
  }

  updatePass (user: User, id: number, code: string): Observable<User> {
    return this.http.post<User>(this.resetUrl+"/"+id+"/"+code,user,  httpOptions).pipe(
      tap((user: User) => {this.notifyUser(`You can now login with your new password` ,'top',"center")
      this.router.navigate(['/login']);
    }//catchError(this.handleError<User>('addUser'))
      ));
  }

  authUser (user: User): Observable<User> {
    return this.http.post<User>(this.authUrl, user, httpOptions).pipe(
      tap((user: User) => {//this.notifyUser(`Congratulations! Please check your email address to activate your user`)
      this.router.navigate(['/portal/'+user.id]);
    }//catchError(this.handleError<User>('addUser'))
      ));
  }

  verifyUser (id: number, code: string): Observable<User> {
  return this.http.post<User>(this.valUrl+"/"+id+"/"+code, httpOptions).pipe(
      tap(() => {//this.notifyUser(`Congratulations! Please check your email address to activate your user`)
      //this.router.navigate(['/login']);
    }
      //catchError(this.handleError<User>('addUser'))
      ));
  }

  notifyUser(message, vertical, horizontal) {
    this.notify.showNotification(vertical,horizontal,message)
  }

    /** Log a HeroService message with the MessageService */
/* private log(message: string) {
  //this.messageService.add(`HeroService: ${message}`);
} */
  constructor(
    private router: Router,
    private http: HttpClient,
    private notify: NotificationsComponent,
    //private cookieService: CookieService
   ) { 
     //httpOptions.headers.append("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS")
     }

 /**
* Handle Http operation that failed.
* Let the app continue.
* @param operation - name of the operation that failed
* @param result - optional value to return as the observable result
*/
/* private handleError<T> (operation = 'operation', result?: T) {
 return (error: any): Observable<T> => {

   // TODO: send the error to remote logging infrastructure
   console.error(error); // log to console instead

   // TODO: better job of transforming error for user consumption
   //this.log(`${operation} failed: ${error.message}`);

   // Let the app keep running by returning an empty result.
   return of(result as T);
 };
} */
}
