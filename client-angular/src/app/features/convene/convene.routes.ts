import { Routes } from "@angular/router";
import { ConveneLayout } from "./layout/convene-layout";

export const routes: Routes = [
  {
    path: '',
    component: ConveneLayout,
    children: [
      { path: '', redirectTo: 'events', pathMatch: 'full' },
      {
        path: 'events',
        loadComponent: () => import('./pages/events/events').then((m) => m.Events),
        children: [
          {
            path: 'new',
            loadComponent: () => import('./pages/new-event/new-event').then((m) => m.NewEvent),
          }
        ]
      },
      {
        path: 'events/:id',
        loadComponent: () =>
          import('./pages/event-details/event-details').then((m) => m.EventDetails),
        children: [
          {
            path: 'edit',
            loadComponent: () => import('./pages/edit-event/edit-event').then((m) => m.EditEvent),
          }
        ]
      }
    ]
  }
]
