import { FirebaseCache } from './../base-class/firebase-cache';
import { Creator } from './../models/user.model';
import { UploadService } from './upload.service';
import { debounceTime, map, shareReplay, switchMap, take, tap, catchError } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, DocumentChangeAction, QueryFn } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import { Content, MetaData, Workshop, Status, ContentDoc } from '../models/workshop.model';
import { combineLatest, Observable, of } from 'rxjs';
import firebase from 'firebase/compat/app';
import { AuthService } from './auth.service';
import { AppModule } from 'src/app/app.module';
import Utils from '../utils/utility-function';
import { UserService } from './user.service';
import { Timestamp } from '../models/form-data-model';

@Injectable({
  providedIn: AppModule
})
export class WorkshopService extends FirebaseCache {

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private userService: UserService,
    private uploadService: UploadService
  ) { 
    super();
  }

  private _getWorkshop: {
    [key: string]: Observable<Workshop | undefined>
  } = { }

  private getWorkshop(id: string) {
    if(id in this._getWorkshop) return this._getWorkshop[id];

    return this._getWorkshop[id] = this.afs.doc<Workshop>(`workshops/${id}`).valueChanges().pipe(
      tap(workshop => console.log(`workshop-${id} read`)),
      shareReplay(1)
    );
  }
  
  private _getContentDoc: {
    [key: string]: Observable<ContentDoc | undefined>
  } = { }

  private getContentDoc(id: string) {
    if(id in this._getContentDoc) return this._getContentDoc[id];

    return this._getContentDoc[id] = this.afs.doc<ContentDoc>(`workshops/${id}/content/0`).valueChanges().pipe(
      catchError(err => of(undefined)),
      tap(contentDoc => console.log(`content-${id} read`)),
      shareReplay(1)
    );
  }

  getWorkshopObj(id: string) {
    return combineLatest([
      this.getWorkshop(id), 
      this.getContentDoc(id)
    ]);
  }

  getCachedWorkshop(id: string) {
    return combineLatest([
      this.getCachedDocument(this.afs.doc<Workshop>(`workshops/${id}`)),
      this.getCachedDocument(this.afs.doc<ContentDoc>(`workshops/${id}/content/0`))
    ]);
  }

  private _activeWorkshops$: Observable<(Workshop & {id: string})[]>;

  private activeWorkshops() {
    if(this._activeWorkshops$) return this._activeWorkshops$;

    const queryDocs = this.afs.collection<Workshop>(
      'workshops', 
      ref => ref
        .where('status', '==', {id: 1, name: 'ACTIVE'})
        .where('updatedAt', '>', this.getToken('ACTIVE_WORKSHOPS'))
    );

    const cachedQueryDocs = this.afs.collection<Workshop>(
      'workshops', 
      ref => ref.where('status', '==', {id: 1, name: 'ACTIVE'})
    );

    return this._activeWorkshops$ = combineLatest([
      queryDocs.valueChanges({idField: 'id'}).pipe(
        tap(workshops => {
          console.log(`${workshops.length} active workshops read`);
          let maxUpdatedAt = 0;
          workshops.forEach(workshop => maxUpdatedAt = 
            workshop.updatedAt > maxUpdatedAt ? 
            workshop.updatedAt : 
            maxUpdatedAt
          )
          if(maxUpdatedAt)
            this.setToken('ACTIVE_WORKSHOPS', maxUpdatedAt);
        })
      ),
      this.getCachedData(cachedQueryDocs).pipe(
        tap(workshops => console.log(`${workshops.length} cached workshops read`))
      )
    ]).pipe(
      map(workshops => 
        Utils.twoArrayIntersection<Workshop & {id: string}>(
          workshops[0], 
          workshops[1], 
          item => item.id
        )
      ),
      map(workshops => workshops.filter(workshop => !workshop.deletedAt)),
      shareReplay(1)
    );
  }

  userEnrolledWorkshopCount = 0;
  userCompletedWorkshopCount = 0;
  userTotalWorkshopCount = 0;
  
  private _enrolledWorkshops$: Observable<(Workshop & {id: string})[]>;

  enrolledWorkshops() {
    if(this._enrolledWorkshops$) return this._enrolledWorkshops$;

    return this._enrolledWorkshops$ = combineLatest([
      this.userService.getMe(),
      this.activeWorkshops()
    ]).pipe(
      tap(userActive => this.userTotalWorkshopCount = userActive[0]!.wids.length),
      map(userActive => 
        userActive[1].filter(workshop => 
          userActive[0]!.wids.includes(workshop.id)
        )
      ),
      tap(workshops => {
        this.userEnrolledWorkshopCount = workshops.length;
        this.userCompletedWorkshopCount = this.userTotalWorkshopCount - this.userEnrolledWorkshopCount;
      }),
      shareReplay(1)
    );
  }
  
  private _upcomingWorkshops$: Observable<(Workshop & {id: string})[]>;

  upcomingWorkshops() {
    if(this._upcomingWorkshops$) return this._upcomingWorkshops$;

    return this._upcomingWorkshops$ = combineLatest([
      this.userService.getMe(),
      this.activeWorkshops()
    ]).pipe(
      map(userActive => 
        userActive[1].filter(workshop => 
          userActive[0]!.wids.includes(workshop.id) == false &&
          workshop.metaData.startDate.toMillis() > Timestamp.now().toMillis()
        )
      ),
      shareReplay(1)
    );
  }

  private _recentCompletedWorkshops$: Observable<(Workshop & {id: string})[]>;

  recentCompletedWorkshops() {
    if(this._recentCompletedWorkshops$) return this._recentCompletedWorkshops$;

    const queryDocs = this.afs.collection<Workshop>(
      'workshops',
      ref => ref
        .where('status', '==', {id: 3, name: 'COMPLETED'})
        .orderBy('metaData.endDate', 'desc')
        .limit(5)
    );

    return this._recentCompletedWorkshops$ = queryDocs.valueChanges({idField: 'id'}).pipe(
      map(workshops => workshops.filter(workshop => !workshop.deletedAt)),
      tap(workshops => console.log(`${workshops.length} recent completed workshops read`)),
      shareReplay(1)
    )
  }

  creatorWorkshopCount = {
    'ACTIVE': 0,
    'ARCHIVED': 0,
    'COMPLETED': 0,
    'DELETED': 0
  };
  creatorTotalWorkshopCount = 0;
  creatorAverageRating = 0;
  creatorStudentsTaught = 0;

  private _creatorWorkshops$: Observable<(Workshop & {id: string})[]>;

  private creatorWorkshops(id: string) {
    if(this._creatorWorkshops$) return this._creatorWorkshops$;

    return this._creatorWorkshops$ = this.afs.collection<Workshop>(
      'workshops',
      ref => ref
        .where('creatorsId', 'array-contains', id)
        .where('updatedAt', '>', this.getToken('CREATOR_WORKSHOPS'))
    ).valueChanges({idField: 'id'}).pipe(
      tap(workshops => {
        console.log(`${workshops.length} creator workshops read`);
        let maxUpdatedAt = 0;
        workshops.forEach(workshop => maxUpdatedAt = 
          workshop.updatedAt > maxUpdatedAt ? 
          workshop.updatedAt : 
          maxUpdatedAt
        )
        if(maxUpdatedAt)
          this.setToken('CREATOR_WORKSHOPS', maxUpdatedAt);
      }),
      shareReplay(1)
    )
  }

  private _creatorWorkshopsStatusWise: {
    [key: string]: Observable<(Workshop & {id: string})[]>
  } = { }

  creatorWorkshopsStatusWise(status: Status) { 
    if(status.name in this._creatorWorkshopsStatusWise) 
      return this._creatorWorkshopsStatusWise[status.name];

    return this._creatorWorkshopsStatusWise[status.name] = this.authService.user$.pipe(
      switchMap(user => {
        if(!user) return of(null);

        return combineLatest([
          this.creatorWorkshops(user.uid),
          this.getCachedData(this.afs.collection<Workshop>(
            'workshops',
            ref => ref
              .where('creatorsId', 'array-contains', user.uid)
          )).pipe(
            tap(workshops => console.log(`${workshops.length} cache creator workshops read`))
          )
        ]);
      }),
      map(workshops => workshops ?
        Utils.twoArrayIntersection<Workshop & {id: string}>(
          workshops[0], 
          workshops[1], 
          item => item.id
        ) : []
      ),
      tap(workshops => {
        this.creatorTotalWorkshopCount = workshops.length;
        this.creatorStudentsTaught = 0;
        this.creatorAverageRating = 0;
        workshops.forEach(workshop => {
          if(this.creatorStudentsTaught + +workshop.metaData.studentCount) {
            this.creatorAverageRating = ((+workshop.metaData.rating * +workshop.metaData.studentCount) + (this.creatorAverageRating * this.creatorStudentsTaught))/(this.creatorStudentsTaught + +workshop.metaData.studentCount)
          }
          this.creatorStudentsTaught += +workshop.metaData.studentCount;
        })
      }),
      map(workshops => 
        workshops.filter(workshop => 
          workshop.status.id == status.id && 
          !workshop.deletedAt
        ).sort((a, b) => b.createdAt - a.createdAt)
      ),
      tap(workshops => {
        this.creatorWorkshopCount[status.name] = workshops.length;
      }),
      shareReplay(1)
    );
  }

  
  firstWorkshopSnap: firebase.firestore.DocumentSnapshot<Workshop> | undefined;
  lastWorkshopSnap: firebase.firestore.DocumentSnapshot<Workshop> | undefined;

  limit: string = '10';
  currentPage: number = 1;
  queryString: string;
  queryWorkshopCount = 0;

  filterObj: {
    courseId?: string;
    status?: string[];
    creatorsId?: string[];
  } = {};


  private _queryWorkshops: {
    [key: string]: Observable<(Workshop & {id: string})[]>
  } = { }

  queryWorkshops(direction: 'forward' | 'backward' | 'still') {
    const key = `${this.firstWorkshopSnap?.id}_${this.lastWorkshopSnap?.id}_${this.limit}_${this.queryString}`;

    if(key in this._queryWorkshops) return this._queryWorkshops[key];

    return this._queryWorkshops[key] = this.afs.collection<Workshop>(
      'workshops', 
      ref => {
        let query: firebase.firestore.Query<firebase.firestore.DocumentData> = ref.orderBy('createdAt', 'desc');
        if(this.lastWorkshopSnap && direction == 'forward')
          query = query.startAfter(this.lastWorkshopSnap);
        if(this.firstWorkshopSnap && direction == 'backward') 
          query = query.endBefore(this.firstWorkshopSnap);
        if(this.limit != '*')
          query = this.firstWorkshopSnap ? query.limitToLast(+this.limit) : query.limit(+this.limit);
        if(this.filterObj.courseId)
          query = query.where('courseId', '==', this.filterObj.courseId);
        if(this.filterObj.status)
          query = query.where('status.name', 'in', this.filterObj.status);
        if(this.filterObj.creatorsId && this.filterObj.creatorsId.length)
          query = query.where('creatorsId', 'array-contains-any', this.filterObj.creatorsId);
  
        return query;
      })
      .snapshotChanges()
      .pipe(
        shareReplay(1),
        debounceTime(250),
        map(workshops => {
          if(direction == 'backward') this.currentPage--;
          else if(direction == 'forward') this.currentPage++;
          else this.currentPage = 1;
          
          this.queryWorkshopCount = workshops.length;
          this.firstWorkshopSnap = workshops[0]?.payload.doc as firebase.firestore.DocumentSnapshot<Workshop>;
          this.lastWorkshopSnap = workshops[workshops.length - 1]?.payload.doc as firebase.firestore.DocumentSnapshot<Workshop>;

          return workshops.map(workshop => 
            Object.assign({}, workshop.payload.doc.data(), {id: workshop.payload.doc.id})
          )
        })
      )
  }

  private _allCreators$: Observable<(Creator & {id: string})[]>;

  allCreators() {
    if(this._allCreators$) return this._allCreators$;

    return this._allCreators$ = combineLatest([
      this.afs.collection<Creator>('creators').valueChanges({idField: 'id'}),
      this.getCachedData(this.afs.collection<Creator>('creators'))
    ]).pipe(
      map(creators => Utils.twoArrayIntersection<Creator & {id: string}>(creators[0], creators[1], item => item.id)),
      shareReplay(1)
    );
  }

  private _creator$: Observable<Creator & {id: string}>;

  creator() {
    if(this._creator$) return this._creator$;

    return this._creator$ = this.authService.user$.pipe(
      switchMap(user => {
        if(!user) return of(null);

        return this.afs.doc<Creator>(`creators/${user.uid}`).valueChanges({idField: 'id'}).pipe(tap(creator => console.log(`${creator?.name} creator read`)))
      }),
      map(creator => Object.assign({}, creator)),
      shareReplay(1)
    )
  }

  updateWorkshop(uri: string, body: {[key: string]: any}): Promise<void> {
    body["updatedAt"] = Timestamp.now().toMillis();

    return this.afs.doc<{[key: string]: any}>(uri).update(body);
  }

  async createWorkshop() {
    const currentUser = await this.afAuth.currentUser;
    if(!currentUser) return new Promise<void>(() => {});

    const time = Timestamp.now().toMillis();

    const status = Object.assign({}, new Status());
    const metaData = Object.assign({}, new MetaData('New Workshop'));
    
    return await combineLatest([
      this.creator(),
      this.uploadService.createFolder(`${time}`)
    ]).pipe(take(1)).toPromise()
    .then(res => {
      const creatorsId = res[0].id;
      const { id, ...creators } = res[0];
      const folderUri = res[1];

      return this.afs.collection('workshops').add({
        status,
        metaData,
        creators: firebase.firestore.FieldValue.arrayUnion(creators),
        creatorsId: firebase.firestore.FieldValue.arrayUnion(creatorsId),
        folderUri,
        courseId: time,
        createdAt: time,
        updatedAt: time,
        deletedAt: null
      })
    })
    .then(docRef => {
      this.afs.doc<ContentDoc>(`workshops/${docRef.id}/content/0`).set({
        content: [],
        createdAt: time,
        updatedAt: time,
        deletedAt: null
      });
      this.addToWids(`creators/${currentUser.uid}`, docRef.id);
      return {
        id: docRef.id,
        title: 'New Workshop'
      };
    })

  }

  async launchAgain(wid: string) {
    const currentUser = await this.afAuth.currentUser;
    if(!currentUser) return new Promise<void>(() => {});

    let content: Content[];
    let title = 'New Workshop';
    const time = Timestamp.now().toMillis();
    
    return this.getCachedWorkshop(wid).toPromise()
    .then(workshop => {
      content = workshop[1]!.content;
      title = workshop[0]!.metaData.title;
      
      return this.afs.collection('workshops')
      .add({
        status: Object.assign({}, new Status()),
        metaData: Object.assign({}, workshop[0]!.metaData),
        creators: firebase.firestore.FieldValue.arrayUnion(...workshop[0]!.creators),
        creatorsId: firebase.firestore.FieldValue.arrayUnion(...workshop[0]!.creatorsId),
        folderUri: workshop[0]!.folderUri,
        courseId: workshop[0]!.courseId,
        createdAt: time,
        updatedAt: time,
        deletedAt: null
      })
    })
    .then(docRef => {
      this.afs.doc<ContentDoc>(`workshops/${docRef.id}/content/0`).set({ 
        content: JSON.parse(JSON.stringify(content)),
        createdAt: time,
        updatedAt: time,
        deletedAt: null
      });
      this.addToWids(`creators/${currentUser.uid}`, docRef.id);
      return {
        id: docRef.id,
        title: title
      };
    });
  }

  addToWids(uri: string, wid: string) {
    return this.afs.doc(uri).update({
      wids: firebase.firestore.FieldValue.arrayUnion(wid),
      updatedAt: Timestamp.now().toMillis()
    })
  }

  removeFromWids(uri: string, wid: string) {
    return this.afs.doc(uri).update({
      wids: firebase.firestore.FieldValue.arrayRemove(wid),
      updatedAt: Timestamp.now().toMillis()
    })
  }

  async deleteWorkshop(id: string) {
    const currentUser = await this.afAuth.currentUser;
    if(!currentUser) return;

    const time = Timestamp.now().toMillis();
    
    return Promise.all([
      this.updateWorkshop(`workshops/${id}/content/0`, {
        deletedAt: time
      }),
      this.updateWorkshop(`workshops/${id}`, {
        deletedAt: time,
        status: {id: 4, name: 'DELETED'}
      }),
      this.removeFromWids(`creators/${currentUser.uid}`, id)
    ]);
  }

  hardDeleteWorkshop(id: string) {
    return Promise.all([
      this.afs.doc(`workshops/${id}/content/0`).delete(),
      this.afs.doc(`workshops/${id}`).delete()
    ]);
  }

}
