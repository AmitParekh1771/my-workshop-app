import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainAppComponent } from './main-app.component';
import { AdminRouteGuard, CreatorRouteGuard } from './shared/services/route-guard.service';

const routes: Routes = [
  { 
    path: '',
    component: MainAppComponent,
    children: [
      {
        path: '', redirectTo: 'account', pathMatch: 'full'
      },
      { 
        path: 'account', 
        loadChildren: () => import('./account/account.module').then(m => m.AccountModule) 
      },
      { 
        path: 'workshop', 
        loadChildren: () => import('./workshop/workshop.module').then(m => m.WorkshopModule) 
      },
      { 
        path: 'creator', 
        loadChildren: () => import('./creator/creator.module').then(m => m.CreatorModule),
        canActivate: [CreatorRouteGuard]
      },
      { 
        path: 'admin', 
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
        canActivate: [AdminRouteGuard]
      },
    ],
    
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainAppRoutingModule { }
