import { Routes } from '@angular/router';
import { TalkiveLayoutComponent } from './layout/talkive-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: TalkiveLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/login/login.component').then(m => m.TalkiveLoginComponent)
      },
      {
        path: 'chat',
        loadComponent: () => import('./pages/chat/chat.component').then(m => m.ChatComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  }
];
