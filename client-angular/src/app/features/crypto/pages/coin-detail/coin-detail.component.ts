import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CryptoService, ICoinDetail } from '../../../../core/services/crypto/crypto.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-coin-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="coin-detail-container">
      <a routerLink="/systems/crypto" class="back-link">← Voltar para lista</a>

      @if (loading()) {
        <p>Carregando detalhes...</p>
      } @else if (!coin()) {
        <p>Nao foi possivel carregar os detalhes da moeda.</p>
      } @else {
        <div class="header">
          <img [src]="coin()!.image.large" [alt]="coin()!.name" />
          <h1>{{ coin()!.name }} ({{ coin()!.symbol.toUpperCase() }})</h1>
        </div>

        <div class="grid">
          <div class="info-card">
            <span>Rank</span>
            <strong>{{ coin()!.market_cap_rank }}</strong>
          </div>
          <div class="info-card">
            <span>Preco atual</span>
            <strong>US$ {{ coin()!.market_data.current_price['usd'].toLocaleString() }}</strong>
          </div>
          <div class="info-card">
            <span>Alta 24h</span>
            <strong>US$ {{ coin()!.market_data.high_24h['usd'].toLocaleString() }}</strong>
          </div>
          <div class="info-card">
            <span>Baixa 24h</span>
            <strong>US$ {{ coin()!.market_data.low_24h['usd'].toLocaleString() }}</strong>
          </div>
        </div>
      }
    </section>
  `,
  styles: [`
    .coin-detail-container {
      padding: 6rem 1rem 2rem;
      max-width: 920px;
      margin: 0 auto;
    }
    .back-link {
      color: #2563eb;
      text-decoration: none;
      display: inline-block;
      margin-bottom: 1rem;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .header img {
      width: 56px;
      height: 56px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 0.8rem;
    }
    .info-card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 0.9rem;
    }
    .info-card span {
      display: block;
      color: #6b7280;
      font-size: 0.85rem;
      margin-bottom: 0.4rem;
    }
  `]
})
export class CoinDetailComponent {
  coin = signal<ICoinDetail | null>(null);
  loading = signal(false);

  constructor(
    private route: ActivatedRoute,
    private cryptoService: CryptoService,
    private toastService: ToastService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCoin(id);
    }
  }

  loadCoin(id: string): void {
    this.loading.set(true);
    this.cryptoService.getCoin(id).subscribe({
      next: (data) => {
        this.coin.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Erro ao carregar detalhes da moeda.');
      }
    });
  }
}










