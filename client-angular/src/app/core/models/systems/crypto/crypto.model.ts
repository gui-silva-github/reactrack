export interface ICoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: Date;
  atl: number;
  atl_change_percentage: number;
  atl_date: Date;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  last_updated: Date;
}

export interface ICurrency {
  name: string;
  symbol: string;
}

export interface ISpecificCoinData {
  symbol: string;
  name: string;
  image: {
    large: string;
  };
  market_cap_rank: number;
  market_data: {
    current_price: {
      [currency: string]: number;
    };
    market_cap: {
      [currency: string]: number;
    };
    high_24h: {
      [currency: string]: number;
    };
    low_24h: {
      [currency: string]: number;
    };
    price_change_percentage_24h?: number;
  };
}

export interface IPricesCoinData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface ICoinContext {
  allCoin: ICoinData[];
  currency: ICurrency;
}
