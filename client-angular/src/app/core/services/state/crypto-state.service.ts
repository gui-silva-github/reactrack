import { Injectable, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { ICoinData, ICurrency } from '../../models';
import { CryptoService } from '../crypto/crypto.service';

@Injectable({ providedIn: 'root' })
export class CryptoStateService {
  private readonly cryptoService = inject(CryptoService);

  private readonly allCoinSignal = signal<ICoinData[]>([]);
  private readonly displayCoinSignal = signal<ICoinData[]>([]);
  private readonly currencySignal = signal<ICurrency>({ name: 'usd', symbol: '$' });
  private readonly loadingSignal = signal(false);
  private readonly searchTermSignal = signal('');

  readonly allCoin = this.allCoinSignal.asReadonly();
  readonly displayCoin = this.displayCoinSignal.asReadonly();
  readonly currency = this.currencySignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly searchTerm = this.searchTermSignal.asReadonly();
  readonly filteredCoins = computed(() => this.displayCoinSignal().slice(0, 10));

  constructor() {
    this.loadCoins();
  }

  setCurrency(currency: ICurrency): void {
    this.currencySignal.set(currency);
    this.loadCoins();
  }

  setSearchTerm(term: string): void {
    this.searchTermSignal.set(term);
    if (!term) {
      this.displayCoinSignal.set(this.allCoinSignal());
    }
  }

  searchCoins(): void {
    const query = this.searchTermSignal().trim().toLowerCase();
    if (!query) {
      this.displayCoinSignal.set(this.allCoinSignal());
      return;
    }
    this.displayCoinSignal.set(
      this.allCoinSignal().filter((coin) => coin.name.toLowerCase().includes(query))
    );
  }

  loadCoins(): void {
    this.loadingSignal.set(true);
    this.cryptoService
      .getCurrencyMarkets(this.currencySignal().name)
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (data) => {
          this.allCoinSignal.set(data);
          this.displayCoinSignal.set(data);
        },
        error: () => {
          this.allCoinSignal.set([]);
          this.displayCoinSignal.set([]);
        }
      });
  }
}
