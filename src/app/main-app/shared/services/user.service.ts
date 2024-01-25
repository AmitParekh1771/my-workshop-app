import { FirebaseCache } from './../base-class/firebase-cache';
import { AuthService } from './auth.service';
import { switchMap, shareReplay, tap, debounceTime, map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import { AppModule } from 'src/app/app.module';

@Injectable({
  providedIn: AppModule
})
export class UserService extends FirebaseCache {

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private authService: AuthService
  ) { 
    super();
  }

  private me$: Observable<User | undefined>;

  getMe() {
    if(this.me$) return this.me$;

    return this.me$ = this.authService.user$.pipe(
      switchMap(user => this.afs.doc<User>(`users/${user?.uid}`).valueChanges().pipe(
        tap(user => console.log(`user read`))
      )),
      shareReplay(1)
    );
  }

  async patchMe(body: User): Promise<void> {
    const currentUser = await this.afAuth.currentUser;
    if(!currentUser) return;

    const time = firebase.firestore.Timestamp.now().toMillis();
    
    body["updatedAt"] = time;
    this.setToken(`USER_${currentUser.uid}`, time);

    return this.afs.doc<User>(`users/${currentUser.uid}`).update(body);
  }

  deleteUser(uid: string) {
    return this.afs.doc(`users/${uid}`).delete();
  }
  
  firstUserSnap: firebase.firestore.DocumentSnapshot<User> | undefined;
  lastUserSnap: firebase.firestore.DocumentSnapshot<User> | undefined;

  limit: string = '10';
  currentPage: number = 1;
  queryString: string;
  queryUserCount = 0;

  filterObj: {
    email?: string;
    firstName?: string;
    wids?: string[];
  } = {};


  private _queryUsers: {
    [key: string]: Observable<(User & {id: string})[]>
  } = { }

  queryUsers(direction: 'forward' | 'backward' | 'still') {
    const key = `${this.firstUserSnap?.id}_${this.lastUserSnap?.id}_${this.limit}_${this.queryString}`;

    if(key in this._queryUsers) return this._queryUsers[key];

    return this._queryUsers[key] = this.afs.collection<User>(
      'users', 
      ref => {
        let query: firebase.firestore.Query<firebase.firestore.DocumentData> = ref.orderBy('createdAt', 'desc');
        if(this.lastUserSnap && direction == 'forward')
          query = query.startAfter(this.lastUserSnap);
        if(this.firstUserSnap && direction == 'backward') 
          query = query.endBefore(this.firstUserSnap);
        if(this.limit != '*')
          query = this.firstUserSnap ? query.limitToLast(+this.limit) : query.limit(+this.limit);
        if(this.filterObj.email)
          query = query.where('email', '==', this.filterObj.email);
        if(this.filterObj.firstName)
          query = query.where('firstName', '==', this.filterObj.firstName);
        if(this.filterObj.wids && this.filterObj.wids.length)
          query = query.where('wids', 'array-contains-any', this.filterObj.wids);
  
        return query;
      })
      .snapshotChanges()
      .pipe(
        shareReplay(1),
        debounceTime(250),
        map(users => {
          if(direction == 'backward') this.currentPage--;
          else if(direction == 'forward') this.currentPage++;
          else this.currentPage = 1;
          
          this.queryUserCount = users.length;
          this.firstUserSnap = users[0]?.payload.doc as firebase.firestore.DocumentSnapshot<User>;
          this.lastUserSnap = users[users.length - 1]?.payload.doc as firebase.firestore.DocumentSnapshot<User>;

          return users.map(user => 
            Object.assign({}, user.payload.doc.data(), {id: user.payload.doc.id})
          )
        })
      )
  }

}
