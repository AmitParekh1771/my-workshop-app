import { Subscription } from 'rxjs';
import { SpinnerService } from './shared/services/spinner.service';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from './shared/models/user.model';

@Component({
  selector: 'app-main-app',
  templateUrl: './main-app.component.html',
  styleUrls: ['./main-app.component.css']
})
export class MainAppComponent implements OnInit {

  showMenu = false;
  showSpinner = false;

  subscription = new Subscription();

  constructor(
    private router: Router, 
    private spinnerService: SpinnerService,
    private authService: AuthService,
    private afs: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationStart) this.showSpinner = true;
      else if(event instanceof NavigationEnd) this.showSpinner = false;
    });

    this.spinnerService.spinner.subscribe(val => this.showSpinner = val);
    
    const sub = this.authService.user$
    .subscribe(user => {
      if(!user) return;

      const newUser = Object.assign({}, new User(user.displayName!, user.email!));
      
      this.afs
      .doc<User>(`users/${user.uid}`).get().toPromise()
      .then(docSnapshot => {
        if(docSnapshot.exists) return;
        
        return docSnapshot.ref.set(newUser, {merge: true});
      });

      sub.unsubscribe();
    });
  }

}
