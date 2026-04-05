import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

const COINGECKO_URL = 'https://api.coingecko.com/api/v3';

export interface ICoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  [key: string]: any;
}

export interface ICoinDetail {
  id: string;
  symbol: string;
  name: string;
  market_cap_rank: number;
  image: { large: string };
  market_data: {
    current_price: { [key: string]: number };
    market_cap: { [key: string]: number };
    high_24h: { [key: string]: number };
    low_24h: { [key: string]: number };
    price_change_percentage_24h: number;
  };
  [key: string]: any;
}

export interface IMarketChart {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  constructor(private http: HttpClient) {};

  getCurrencyMarkets(vsCurrency: string = 'usd'): Observable<ICoinMarket[]> {
    const params = new HttpParams().set('vs_currency', vsCurrency);
    return this.http.get<ICoinMarket[]>(`${COINGECKO_URL}/coins/markets`, {
      params
    });
  }

  getCoin(id: string): Observable<ICoinDetail> {
    return this.http.get<ICoinDetail>(`${COINGECKO_URL}/coins/${id}`);
  }

  getMarketChart(
    id: string, vsCurrency: string = 'usd', days: number = 10
  ): Observable<IMarketChart> {
    const params = new HttpParams()
      .set('vs_currency', vsCurrency)
      .set('days', days.toString())
      .set('interval', 'daily')
    return this.http.get<IMarketChart>(
      `${COINGECKO_URL}/coins/${id}/market_chart`, { params }
    );
  }
}
