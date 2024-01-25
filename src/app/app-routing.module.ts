import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, RouterStateSnapshot } from '@angular/router';
import { 
  redirectLoggedInTo,
  redirectUnauthorizedTo,
  canActivate 
} from '@angular/fire/compat/auth-guard';

const redirectUnauthorizedToLogin = (route: any, state: RouterStateSnapshot) => redirectUnauthorizedTo(`/login?returnUrl=${state.url}`);
const redirectLoggedInToApp = () => redirectLoggedInTo('');

const routes: Routes = [
  { 
    path: '', 
    loadChildren: () => import('./main-app/main-app.module').then(m => m.MainAppModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  { 
    path: 'login', 
    component: LoginComponent,
    ...canActivate(redirectLoggedInToApp) 
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
