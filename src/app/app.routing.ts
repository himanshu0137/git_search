import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateLogin } from './guards/can-activate-login.guard';
import { CanActiveDashboard } from './guards/can-activate-dashboard.guard';

const routes: Routes = [
    {
        path: '',
        loadChildren: './login/login.module#LoginModule',
        canActivate: [CanActivateLogin]
    },
    {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule',
        canActivate: [CanActiveDashboard]
    },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
