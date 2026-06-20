import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CRYPTO_URLS } from "../../constants/api-urls";
import {
  ICoinData,
  IPricesCoinData,
  ISpecificCoinData
} from '../../models/systems/crypto/crypto.model';

@Injectable({ providedIn: 'root' })
export class CryptoService {
  constructor(private http: HttpClient) {}

  getCurrencyMarkets(vsCurrency = 'usd'): Observable<ICoinData[]> {
    const params = new HttpParams().set('vs_currency', vsCurrency);
    return this.http.get<ICoinData[]>(CRYPTO_URLS.markets, { params });
  }

  getCoin(id: string): Observable<ISpecificCoinData> {
    return this.http.get<ISpecificCoinData>(CRYPTO_URLS.coin(id));
  }

  getMarketChart(
    id: string,
    vsCurrency = 'usd',
    days = 10
  ): Observable<IPricesCoinData> {
    const params = new HttpParams()
      .set('vs_currency', vsCurrency)
      .set('days', days.toString())
      .set('interval', 'daily');
    return this.http.get<IPricesCoinData>(CRYPTO_URLS.marketChart(id), { params });
  }
}
