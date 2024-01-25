import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AppModule } from './../../../app.module';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay, debounceTime, map } from 'rxjs/operators';
import { Admin } from '../models/user.model';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: AppModule
})
export class AdminService {

  constructor(private afs: AngularFirestore) { }
  
  queryString: string;
  queryAdminCount = 0;

  filterObj: {
    email?: string;
    name?: string;
    wids?: string[];
  } = {};


  private _queryAdmins: {
    [key: string]: Observable<(Admin & {id: string})[]>
  } = { }

  queryAdmins() {
    const key = this.queryString;

    if(key in this._queryAdmins) return this._queryAdmins[key];

    return this._queryAdmins[key] = this.afs.collection<Admin>(
      'admins', 
      ref => {
        let query: firebase.firestore.Query<firebase.firestore.DocumentData> = ref;
        if(this.filterObj.email)
          query = query.where('email', '==', this.filterObj.email);
        if(this.filterObj.name)
          query = query.where('name', '==', this.filterObj.name);
        if(this.filterObj.wids && this.filterObj.wids.length)
          query = query.where('wids', 'array-contains-any', this.filterObj.wids);
  
        return query;
      })
      .snapshotChanges()
      .pipe(
        shareReplay(1),
        debounceTime(250),
        map(admins => {
          this.queryAdminCount = admins.length;
          return admins.map(admin => 
            Object.assign({}, admin.payload.doc.data(), {id: admin.payload.doc.id})
          )
        })
      )
  }

}
