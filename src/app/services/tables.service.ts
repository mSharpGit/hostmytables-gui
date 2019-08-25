import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Occupy } from '../structures/occupy';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Table, Tableid } from '../structures/table';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  private url = environment.apiUrl;
  private TableUrl = this.url + '/table';
  private sectionTableUrl = this.url + '/table/section';

  constructor(private router: Router,
    private http: HttpClient,) { }

    getTable(id): Observable<Table> {
      const url = this.TableUrl+"/" + id;
     return this.http.get<Table>(url).pipe(
       tap(table => console.log(`fetched table`, table))
     ); 
   }

    getTableBatch(ids): Observable<Table[]> {
       const url = this.TableUrl+"/batch/("+ids.join(',')+")";
      return this.http.get<Table[]>(url).pipe(
        tap(table => console.log(`fetched tables`, table))
      ); 
    }
  
  getTables(restaurant_id: number): Observable<Table[]> {
    const url = this.sectionTableUrl+"/"+restaurant_id;
    return this.http.get<Table[]>(url).pipe(
      tap(table => console.log(`fetched Tables restuarant`, table))
    );
  }
}
