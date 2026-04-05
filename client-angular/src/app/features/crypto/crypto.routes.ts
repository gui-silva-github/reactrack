import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/crypto/crypto.component').then(m => m.CryptoComponent)
  },
  {
    path: 'coin/:id',
    loadComponent: () => import('./pages/coin-detail/coin-detail.component').then(m => m.CoinDetailComponent)
  }
];

















