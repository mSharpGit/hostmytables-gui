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

  addTable(table: Table): Observable<Table> {
    return this.http.post<Table>(this.TableUrl, table, httpOptions).pipe(
     tap((table: Table) => {console.log('New table added', table)
   }));
 }

 editTableBatch(table: Table[]): Observable<Table[]> {
  console.log('strigifiy:', JSON.stringify(table), table)
  return this.http.put<Table[]>(this.TableUrl+'/batch', JSON.stringify(table), httpOptions).pipe(
    tap((table: Table[]) => {
      console.log('All Tables updated', table)
    }));
}

editTable(table: Table): Observable<Table> {
  return this.http.put<Table>(this.TableUrl+'/'+ table.id, table, httpOptions).pipe(
   tap((table: Table) => {console.log('Table updated', table)
 }));
}

 deleteTable (table: Table): Observable<Table> {
  const id = typeof table === 'number' ? table : table.id;
  const url = `${this.TableUrl}/${id}`;
  return this.http.delete<Table>(url, httpOptions).pipe(
    tap(_ => console.log(`deleted table id=${id}`))
  );
}
}
