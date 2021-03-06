import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Section } from '../structures/section';
@Injectable({
  providedIn: 'root'
})

export class SectionsService {

  private url = environment.apiUrl;
  private SectionUrl = this.url + '/section';
  private restuarantSectionUrl = this.url + '/section/floor/';

  constructor(private router: Router,
    private http: HttpClient,) { }

    getSection(id: number): Observable<Section> {
      const url = this.SectionUrl+"/"+id;
      return this.http.get<Section>(url).pipe(
        tap(section => console.log(`fetched Section`, section))
      );
    }

  getSections(id: number): Observable<Section[]> {
    const url = this.restuarantSectionUrl+"/"+id;
    return this.http.get<Section[]>(url).pipe(
      tap(section => console.log(`fetched restuarant's Sections`, section))
    );
  }
}
