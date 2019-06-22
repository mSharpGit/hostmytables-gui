import { Injectable } from '@angular/core';
import { User } from '../structures/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import * as moment from "moment";
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
      return this.currentUserSubject.value;
  }

  login(email: string, password: string, stayloged: number) {
    console.log("logging.........")
    
      return this.http.post<any>(environment.apiUrl+`/auth`, { email, password, stayloged }, httpOptions)
          .pipe(map(user => {
              // login successful if there's a jwt token in the response
              if (user && user.token) {
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  localStorage.setItem('currentUser', JSON.stringify(user));
                  localStorage.setItem('Expires', JSON.stringify(user.exp));
                  localStorage.setItem('userID', JSON.stringify(user.user_id));
                  localStorage.setItem('restaurantID', JSON.stringify(user.restaurant_id));
                  this.currentUserSubject.next(user);
              }

              return user;
          }));
  }

  checkToken() {

    return this.http.post<any>(environment.apiUrl+`/users/checktoken`, {null:""}, httpOptions).pipe(map(res => {
     return res.json;
  })).subscribe();
}

  logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('currentUser');
      localStorage.removeItem('Expires');
      this.currentUserSubject.next(null);
  }

  public isLoggedIn() {
      return moment().isBefore(this.getExpiration());
    }
    
    isLoggedOut() {
      return !this.isLoggedIn();
    }
    getExpiration() {
      const expiration = Number(localStorage.getItem("Expires"));
      //const expiresAt = JSON.parse(expiration);
      return moment(expiration * 1000);
    }  
    getRestuarantID() {

      return Number(localStorage.getItem("restaurantID"));

    }  
}
