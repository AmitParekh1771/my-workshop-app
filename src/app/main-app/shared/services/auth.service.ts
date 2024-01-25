import { PopupAlertService } from './../components/popup-container/popup-container.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { of } from 'rxjs';
import { switchMap, map, tap, shareReplay, take } from 'rxjs/operators';
import { FirebaseCache } from '../base-class/firebase-cache';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends FirebaseCache {

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private route: ActivatedRoute,
    private popupAlert: PopupAlertService
  ) { 
    super();
  }

  user$ = this.afAuth.authState.pipe(shareReplay(1));

  isAdmin$ = this.afAuth.authState.pipe(
    switchMap(user => {
      if(!user) return of(false);
      return this.afs.doc(`admins/${user.uid}`).get().pipe(
        map(doc => doc.exists)
      )
    })
  );

  isCreator$ = this.afAuth.authState.pipe(
    switchMap(user => {
      if(!user) return of(false);
      return this.afs.doc(`creators/${user.uid}`).get().pipe(
        map(doc => doc.exists)
      )
    })
  );

  googleSignin() {
    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(this.signInCallBack.bind(this))
      .catch(this.showAlertOnError.bind(this));
  }

  githubSignin() {
    this.afAuth.signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then(this.signInCallBack.bind(this))
      .catch(this.showAlertOnError.bind(this));
  }

  facebookSignin() {
    this.afAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(this.signInCallBack.bind(this))
      .catch(this.showAlertOnError.bind(this));
  }

  microsoftSignin() {
    this.afAuth.signInWithPopup(new firebase.auth.OAuthProvider('microsoft.com'))
      .then(this.signInCallBack.bind(this))
      .catch(this.showAlertOnError.bind(this));
  }

  signInCallBack() {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    this.router.navigate([returnUrl || '/']);
  }

  showAlertOnError(err: any) {
    let errMessage = 'Something went wrong! Try again later.';

    if(err.code == 'auth/account-exists-with-different-credential')
      errMessage = `An account already exists with the same email address but different sign-in credentials. Try sign in using a provider associated with this email address.`;

    this.popupAlert.open({
      type: 'ERROR',
      title: 'ERROR',
      alertMessage: errMessage
    });
  }

  authSignout() {
    this.afAuth.signOut()
      .then(() => {
        this.router.navigate(['/login']);
      });
  }

}
