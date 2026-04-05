import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'events',
    pathMatch: 'full'
  },
  {
    path: 'events',
    loadComponent: () => import('./pages/events/events.component').then(m => m.EventsComponent),
    children: [
      {
        path: 'new',
        loadComponent: () => import('./pages/new-event/new-event.component').then(m => m.NewEventComponent)
      }
    ]
  },
  {
    path: 'events/:id',
    loadComponent: () => import('./pages/event-details/event-details.component').then(m => m.EventDetailsComponent),
    children: [
      {
        path: 'edit',
        loadComponent: () => import('./pages/edit-event/edit-event.component').then(m => m.EditEventComponent)
      }
    ]
  }
];

















