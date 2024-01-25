import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppModule } from 'src/app/app.module';

@Injectable({
  providedIn: AppModule
})
export class CreatorRouteGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): Observable<boolean> {
    return this.authService.isCreator$.pipe(
      map(isCreator => {
        if(isCreator) return true;

        this.router.navigate(['not-found']);
        return false;
      })
    );
  }
}

@Injectable({
  providedIn: AppModule
})
export class AdminRouteGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): Observable<boolean> {
    return this.authService.isAdmin$.pipe(
      map(isAdmin => {
        if(isAdmin) return true;

        this.router.navigate(['not-found']);
        return false;
      })
    );
  }
}
