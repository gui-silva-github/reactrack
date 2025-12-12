import { coinGeckoUrl } from "../geral";

export const getCurrency: string = `${coinGeckoUrl}/coins/markets?vs_currency=` 

export const getCoin: string = `${coinGeckoUrl}/coins/`

export const getMarketChart: string = `market_chart?vs_currency=`

export const getDays: string = `days=10&interval=daily`