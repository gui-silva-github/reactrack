import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PT } from '../../../../core/constants/i18n-pt';
import { IPricesCoinData, ISpecificCoinData } from '../../../../core/models';
import { CryptoService } from '../../../../core/services/crypto/crypto.service';
import { CryptoStateService } from '../../../../core/services/state/crypto-state.service';
import { CryptoNavbar } from '../../components/crypto-navbar/crypto-navbar';
import { LineChart } from "../../components/line-chart/line-chart";

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
  readonly t = PT.crypto;

  private readonly coinId = this.route.snapshot.paramMap.get('id') ?? '';

  coin = signal<ISpecificCoinData | null>(null);
  chart = signal<IPricesCoinData | null>(null);

  get currencyName() {
    return this.cryptoState.currency().name;
  }

  constructor() {
    if (this.coinId) {
      this.loadCoin(this.coinId);

      effect(() => {
        const currency = this.cryptoState.currency().name;
        this.loadChart(this.coinId, currency);
      })
    }
  }

  loadCoin(id: string): void {
    this.cryptoService.getCoin(id).subscribe({
      next: (data) => this.coin.set(data),
      error: () => this.coin.set(null),
    });
  }

  loadChart(id: string, currency: string): void {
    this.chart.set(null);
    this.cryptoService.getMarketChart(id, currency).subscribe({
      next: (data) => this.chart.set(data),
      error: () => this.chart.set(null),
    });
  }
}
