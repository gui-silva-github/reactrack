import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CryptoStateService } from '../../../../core/services/state/crypto-state.service';
import { I18nService } from '../../../../core/services/i18n/i18n.service';
import { CryptoNavbar } from '../../components/crypto-navbar/crypto-navbar';

@Component({
  selector: 'app-crypto',
  imports: [RouterLink, FormsModule, CryptoNavbar],
  templateUrl: './crypto.html',
  styleUrl: './crypto.css',
})
export class Crypto {
  readonly cryptoState = inject(CryptoStateService);
  readonly i18n = inject(I18nService);
}
