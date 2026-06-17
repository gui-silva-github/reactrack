import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/crypto/crypto').then(m => m.Crypto)
  },
  {
    path: 'coin/:id',
    loadComponent: () => import('./pages/coin-detail/coin-detail').then(m => m.CoinDetail)
  }
]

















