import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IPricesCoinData, ISpecificCoinData } from '../../../../core/models';
import { CryptoService } from '../../../../core/services/crypto/crypto.service';
import { CryptoStateService } from '../../../../core/services/state/crypto-state.service';
import { I18nService } from '../../../../core/services/i18n/i18n.service';
import { CryptoNavbar } from '../../components/crypto-navbar/crypto-navbar';
import { LineChart } from '../../components/line-chart/line-chart';

@Component({
  selector: 'app-coin-detail',
  imports: [CryptoNavbar, LineChart],
  templateUrl: './coin-detail.html',
  styleUrl: './coin-detail.css',
})
export class CoinDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly cryptoService = inject(CryptoService);
  readonly cryptoState = inject(CryptoStateService);
  readonly i18n = inject(I18nService);

  private readonly coinId = this.route.snapshot.paramMap.get('id') ?? '';

  coin = signal<ISpecificCoinData | null>(null);
  chart = signal<IPricesCoinData | null>(null);
  chartVersion = signal(0);
  coinLoading = signal(true);
  chartLoading = signal(true);

  get currencyName(): string {
    return this.cryptoState.currency().name;
  }

  constructor() {
    if (!this.coinId) return;

    this.loadCoin(this.coinId);

    effect((onCleanup) => {
      const currency = this.cryptoState.currency().name;
      const sub = this.loadChart(this.coinId, currency);
      onCleanup(() => sub.unsubscribe());
    });
  }

  loadCoin(id: string): void {
    this.coinLoading.set(true);
    this.cryptoService.getCoin(id).subscribe({
      next: (data) => {
        this.coin.set(data);
        this.coinLoading.set(false);
      },
      error: () => {
        this.coin.set(null);
        this.coinLoading.set(false);
      },
    });
  }

  loadChart(id: string, currency: string): Subscription {
    this.chartLoading.set(true);
    this.chart.set(null);

    return this.cryptoService.getMarketChart(id, currency).subscribe({
      next: (data) => {
        this.chart.set(data);
        this.chartLoading.set(false);
        this.chartVersion.update((v) => v + 1);
      },
      error: () => {
        this.chart.set(null);
        this.chartLoading.set(false);
      },
    });
  }

  formatPrice(value: number | undefined): string {
    if (value == null) return '—';
    return `${this.cryptoState.currency().symbol} ${value.toLocaleString()}`;
  }
}
