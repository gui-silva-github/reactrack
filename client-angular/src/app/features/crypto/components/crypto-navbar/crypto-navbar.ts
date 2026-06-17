import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CryptoStateService } from '../../../../core/services/state/crypto-state.service';
import { ICurrency } from '../../../../core/models';

@Component({
  selector: 'app-crypto-navbar',
  imports: [RouterLink],
  templateUrl: './crypto-navbar.html',
  styleUrl: './crypto-navbar.css',
})
export class CryptoNavbar {
  readonly cryptoState = inject(CryptoStateService);

  onCurrencyChange(event: Event): void {
    const value = (event?.target as HTMLSelectElement).value;
    const map: Record<string, ICurrency> = {
      usd: { name: 'usd', symbol: '$' },
      eur: { name: 'eur', symbol: '€' },
      brl: { name: 'brl', symbol: 'R$' },
      inr: { name: 'inr', symbol: '₹' },
    };
    this.cryptoState.setCurrency(map[value] ?? map['usd']);
  }
}
