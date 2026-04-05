import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CryptoService, ICoinMarket } from '../../../../core/services/crypto/crypto.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-crypto',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <section class="crypto-container">
      <header class="hero">
        <h1>Mercado de Criptomoeda</h1>
        <p>Explore as principais moedas e acesse os detalhes.</p>

        <form class="search" (ngSubmit)="search()">
          <input
            type="text"
            name="searchTerm"
            [(ngModel)]="searchTerm"
            placeholder="Procure pelas criptomoedas..."
            required
          />
          <button type="submit">Procurar</button>
          <button type="button" class="secondary" (click)="reset()">Limpar</button>
        </form>
      </header>

      @if (loading()) {
        <p>Carregando moedas...</p>
      } @else if (filteredCoins().length === 0) {
        <p>Nenhuma moeda encontrada.</p>
      } @else {
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Moeda</th>
                <th>Preco</th>
                <th>24h</th>
                <th>Market Cap</th>
              </tr>
            </thead>
            <tbody>
              @for (coin of filteredCoins(); track coin.id) {
                <tr>
                  <td>{{ coin.market_cap_rank }}</td>
                  <td class="coin-cell">
                    <img [src]="coin.image" [alt]="coin.name" />
                    <a [routerLink]="['/systems/crypto/coin', coin.id]">
                      {{ coin.name }} - {{ coin.symbol.toUpperCase() }}
                    </a>
                  </td>
                  <td>US$ {{ coin.current_price.toLocaleString() }}</td>
                  <td [class.positive]="coin.price_change_percentage_24h > 0" [class.negative]="coin.price_change_percentage_24h <= 0">
                    {{ coin.price_change_percentage_24h.toFixed(2) }}%
                  </td>
                  <td>US$ {{ coin.market_cap.toLocaleString() }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>
  `,
  styles: [`
    .crypto-container {
      padding: 6rem 1rem 2rem;
      max-width: 1100px;
      margin: 0 auto;
    }
    .hero {
      margin-bottom: 1rem;
    }
    .search {
      margin-top: 0.8rem;
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    input, button {
      border: 1px solid #d1d5db;
      border-radius: 8px;
      padding: 0.6rem 0.8rem;
    }
    button {
      background: #2563eb;
      color: #fff;
      border: none;
      cursor: pointer;
    }
    button.secondary {
      background: #4b5563;
    }
    .table-wrap {
      overflow-x: auto;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      background: #fff;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      text-align: left;
      padding: 0.7rem;
      border-bottom: 1px solid #f3f4f6;
    }
    .coin-cell {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .coin-cell img {
      width: 22px;
      height: 22px;
    }
    .coin-cell a {
      color: #1d4ed8;
      text-decoration: none;
    }
    .positive {
      color: #15803d;
      font-weight: 600;
    }
    .negative {
      color: #b91c1c;
      font-weight: 600;
    }
  `]
})
export class CryptoComponent {
  coins = signal<ICoinMarket[]>([]);
  displayedCoins = signal<ICoinMarket[]>([]);
  searchTerm = '';
  loading = signal(false);
  filteredCoins = computed(() => this.displayedCoins().slice(0, 20));

  constructor(
    private cryptoService: CryptoService,
    private toastService: ToastService
  ) {
    this.loadCoins();
  }

  loadCoins(): void {
    this.loading.set(true);
    this.cryptoService.getCurrencyMarkets('usd').subscribe({
      next: (data) => {
        this.coins.set(data);
        this.displayedCoins.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Erro ao carregar moedas.');
      }
    });
  }

  search(): void {
    const query = this.searchTerm.trim().toLowerCase();
    if (!query) {
      this.displayedCoins.set(this.coins());
      return;
    }

    const result = this.coins().filter((coin) => coin.name.toLowerCase().includes(query));
    this.displayedCoins.set(result);
  }

  reset(): void {
    this.searchTerm = '';
    this.displayedCoins.set(this.coins());
  }
}










