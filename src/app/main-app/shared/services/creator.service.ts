import { AppModule } from './../../../app.module';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { Creator } from '../models/user.model';
import { Observable } from 'rxjs';
import { shareReplay, debounceTime, map } from 'rxjs/operators';

@Injectable({
  providedIn: AppModule
})
export class CreatorService {

  constructor(private afs: AngularFirestore) { }

  getCreator(cid: string) {
    return this.afs.doc<Creator>(`creators/${cid}`).get().pipe(
      map(creator => Object.assign({}, creator.data()))
    );
  }
  
  firstCreatorSnap: firebase.firestore.DocumentSnapshot<Creator> | undefined;
  lastCreatorSnap: firebase.firestore.DocumentSnapshot<Creator> | undefined;

  limit: string = '10';
  currentPage: number = 1;
  queryString: string;
  queryCreatorCount = 0;

  filterObj: {
    email?: string;
    name?: string;
    wids?: string[];
  } = {};


  private _queryCreators: {
    [key: string]: Observable<(Creator & {id: string})[]>
  } = { }

  queryCreators(direction: 'forward' | 'backward' | 'still') {
    const key = `${this.firstCreatorSnap?.id}_${this.lastCreatorSnap?.id}_${this.limit}_${this.queryString}`;

    if(key in this._queryCreators) return this._queryCreators[key];

    return this._queryCreators[key] = this.afs.collection<Creator>(
      'creators', 
      ref => {
        let query: firebase.firestore.Query<firebase.firestore.DocumentData> = ref.orderBy('createdAt', 'desc');
        if(this.lastCreatorSnap && direction == 'forward')
          query = query.startAfter(this.lastCreatorSnap);
        if(this.firstCreatorSnap && direction == 'backward') 
          query = query.endBefore(this.firstCreatorSnap);
        if(this.limit != '*')
          query = this.firstCreatorSnap ? query.limitToLast(+this.limit) : query.limit(+this.limit);
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
        map(creators => {
          if(direction == 'backward') this.currentPage--;
          else if(direction == 'forward') this.currentPage++;
          else this.currentPage = 1;
          
          this.queryCreatorCount = creators.length;
          this.firstCreatorSnap = creators[0]?.payload.doc as firebase.firestore.DocumentSnapshot<Creator>;
          this.lastCreatorSnap = creators[creators.length - 1]?.payload.doc as firebase.firestore.DocumentSnapshot<Creator>;

          return creators.map(creator => 
            Object.assign({}, creator.payload.doc.data(), {id: creator.payload.doc.id})
          )
        })
      )
  }

  giveCreatorAccess(cid: string, name: string, email: string) {
    const newCreator = Object.assign({}, new Creator(name, email));
    return this.afs.doc<Creator>(`creators/${cid}`).get().toPromise()
    .then(docSnapshot => {
      if(docSnapshot.exists) return;
      
      return docSnapshot.ref.set(newCreator, {merge: true});
    });
  }

  removeCreatorAccess(cid: string) {
    return this.afs.doc<Creator>(`creators/${cid}`).delete();
  }

}
