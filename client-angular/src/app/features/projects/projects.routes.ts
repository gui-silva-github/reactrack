import { Routes } from '@angular/router';
import { ProjectsLayout } from './layout/projects-layout/projects-layout';

export const routes: Routes = [
  {
    path: '',
    component: ProjectsLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home)
      }
    ]
  }
]
