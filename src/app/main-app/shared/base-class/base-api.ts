import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Options } from '../models/http-option.model';
import { AppError } from '../errors/app-error';
import { NotFound } from '../errors/not-found';
import { BadRequest } from '../errors/bad-request';


export class BaseApi {

  constructor(public http: HttpClient) { }

  get<T>(url: string, options?: Options) {
    return this.http.get<T>(url, options)
      .pipe(catchError(this.handleErrors));
  }

  post<T, K>(url: string, body: T, options?: Options) {
    return this.http.post<K>(url, body, options)
      .pipe(catchError(this.handleErrors));
  }

  update<T, K>(url: string, body: T, options?: Options) {
    return this.http.put<K>(url, body, options)
      .pipe(catchError(this.handleErrors));
  }

  patch<T, K>(url: string, body: T, options?: Options) {
    return this.http.patch<K>(url, body, options)
      .pipe(catchError(this.handleErrors));
  }

  delete<T>(url: string, options?: Options) {
    return this.http.delete<T>(url, options)
      .pipe(catchError(this.handleErrors));
  }


  private handleErrors(error: Response) {
    if(error.status === 400)
      return throwError(new NotFound());

    if(error.status === 404)
      return throwError(new BadRequest(error));

    return throwError(new AppError(error));
  }

}
