import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { SystemsLayoutComponent } from './layouts/systems-layout/systems-layout';
import { ResetPasswordComponent } from './features/auth/pages/reset-password/reset-password.component';
import { EmailVerifyComponent } from './features/auth/pages/email-verify/email-verify.component';
import { SignupComponent } from './features/auth/pages/signup/signup.component';
import { HomeComponent } from './features/auth/pages/home/home.component';
import { LoginComponent } from './features/auth/pages/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'email-verify', component: EmailVerifyComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'systems', component: SystemsLayoutComponent, canActivate: [authGuard], children: [
    { path: '', loadComponent: () => import('./features/systems/pages/dashboard/dashboard.component').then(m => m.SystemsDashboardComponent) },
    { path: 'fit', loadChildren: () => import('./features/fit/fit.routes').then(m => m.routes) },
    { path: 'crypto', loadChildren: () => import('./features/crypto/crypto.routes').then(m => m.routes) },
    { path: 'opinly', loadChildren: () => import('./features/opinly/opinly.routes').then(m => m.routes) },
    { path: 'talkive', loadChildren: () => import('./features/talkive/talkive.routes').then(m => m.routes) },
    { path: 'investments', loadChildren: () => import('./features/investments/investments.routes').then(m => m.routes) },
    { path: 'movies', loadChildren: () => import('./features/movies/movies.routes').then(m => m.routes) },
    { path: 'convene', loadChildren: () => import('./features/convene/convene.routes').then(m => m.routes) },
    { path: 'projects', loadChildren: () => import('./features/projects/projects.routes').then(m => m.routes) }
  ] },
  { path: '**', redirectTo: '' }
];
