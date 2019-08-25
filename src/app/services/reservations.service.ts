import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Occupy } from '../structures/occupy';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  private url = environment.apiUrl;
  private apiUrl = this.url + '/reservations';
  private reservationUrl = this.url + '/reservation';
  
  constructor(private router: Router,
    private http: HttpClient,) { }

  getReservations(id: number, date: string):Observable<Occupy[]>{
    
    return this.http.get<Occupy[]>(this.apiUrl+"/id="+id+"&date='"+date+"'", httpOptions).pipe(
      tap(occupy => console.log('fetched reservations', occupy))
    ); 
  }

  addReservation(occupy: Occupy): Observable<Occupy> {
     return this.http.post<Occupy>(this.reservationUrl, occupy, httpOptions).pipe(
      tap((occupy: Occupy) => {console.log('New reservation added', occupy)
    }));
  }

  editReservation(occupy: Occupy): Observable<Occupy> {
    return this.http.put<Occupy>(this.reservationUrl+'/'+ occupy.id, occupy, httpOptions).pipe(
     tap((occupy: Occupy) => {console.log('Reservation updated', occupy)
   }));
 }

  deleteReservation (occupy: Occupy): Observable<Occupy> {
    const id = typeof occupy === 'number' ? occupy : occupy.id;
    const url = `${this.reservationUrl}/${id}`;
    return this.http.delete<Occupy>(url, httpOptions).pipe(
      tap(_ => console.log(`deleted reservation id=${id}`))
    );
  }

  updateReservation (occupy: Occupy): Observable<Occupy> {
    const id = typeof occupy === 'number' ? occupy : occupy.id;
    const url = `${this.reservationUrl}/${id}`;
    return this.http.put<Occupy>(url, occupy, httpOptions).pipe(
      tap(_ => console.log(`reservation id=${id} status changed`))
    );
  }


}
