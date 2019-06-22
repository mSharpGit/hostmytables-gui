import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Floor } from '../structures/floor';
@Injectable({
  providedIn: 'root'
})
export class FloorsService {

  private url = environment.apiUrl;
  private restuarantFloorUrl = this.url + '/floor/restaurant/';

  constructor(private router: Router,
    private http: HttpClient,) { }

  getFloors(id: number): Observable<Floor[]> {
    const url = this.restuarantFloorUrl+"/"+id;
    return this.http.get<Floor[]>(url).pipe(
      tap(floor => console.log(`fetched Floors restuarant`, floor))
    );
  }
}
