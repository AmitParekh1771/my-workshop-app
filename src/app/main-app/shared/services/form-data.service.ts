
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OCCUPATIONS } from 'src/assets/data/occupations';
import { SKILLS } from 'src/assets/data/skills';
import { environment } from 'src/environments/environment';
import { MainAppModule } from '../../main-app.module';
import { City, Country, State } from '../models/form-data-model';
import { BaseApi } from '../base-class/base-api';
import { first, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: MainAppModule
})
export class FormDataService extends BaseApi {

  constructor(public http: HttpClient) { 
    super(http);
  }

  CSCOption = {
    headers: new HttpHeaders({"X-CSCAPI-KEY": environment['X-CSCAPI-KEY']})
  }

  private countries$: Observable<Country[]>;

  getCountries(): Observable<Country[]> {
    if(this.countries$) return this.countries$;

    const url = "https://api.countrystatecity.in/v1/countries";
    
    return this.countries$ = this.get<Country[]>(url, this.CSCOption).pipe(shareReplay(1));
  }

  private states$: {
    [key: string]: Observable<State[]>
  } = { };

  getStates(country?: Country): Observable<State[]> {
    const key = `${country?.name}`;

    if(key in this.states$) return this.states$[key];

    let url = "https://api.countrystatecity.in/v1/countries/IN/states";
    if(country)
      url = `https://api.countrystatecity.in/v1/countries/${country.iso2}/states`;
      
    return this.states$[key] = this.get<State[]>(url, this.CSCOption).pipe(shareReplay(1));
  }
  
  private cities$: {
    [key: string]: Observable<City[]>
  } = { };

  getCities(country?: Country, state?: State): Observable<City[]> {
    const key = `${country?.name}_${state?.name}`;

    if(key in this.cities$) return this.cities$[key];

    let url = "https://api.countrystatecity.in/v1/countries/IN/states/GJ/cities";
    if(country) {
      url = `https://api.countrystatecity.in/v1/countries/${country.iso2}/cities`;
      if(state)
        url = `https://api.countrystatecity.in/v1/countries/${country.iso2}/states/${state.iso2}/cities`;
    }
    
    return this.cities$[key] = this.get<City[]>(url, this.CSCOption).pipe(shareReplay(1));
  }

  areaOfInterest = SKILLS;
  gender = [
    {id: 1, name: "Male"},
    {id: 2, name: "Female"},
    {id: 3, name: "Other"}
  ];
  profession = OCCUPATIONS;
  
}
