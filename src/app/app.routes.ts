import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { AuthService } from './services';
import { Dictionary, Group, Home, Login, Practice, Profile, Rules, Shell } from './pages';

const authGuard: CanActivateFn = () => inject(AuthService).user() ? true : inject(Router).createUrlTree(['/login']);

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', component: Shell, canActivate: [authGuard], children: [
    { path: '', component: Home },
    { path: 'practice', component: Practice },
    { path: 'group', component: Group },
    { path: 'dictionary', component: Dictionary },
    { path: 'rules', component: Rules },
    { path: 'profile', component: Profile },
  ] },
  { path: '**', redirectTo: '' },
];
