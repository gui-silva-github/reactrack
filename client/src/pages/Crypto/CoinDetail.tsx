import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { CoinContext } from "@/context/Coin/CoinContext"
import classes from "./CoinDetail.module.css"
import { fetchData } from "@/utils/systems/fit"
import { getCoin, getDays, getMarketChart } from "@/api/urls/coin"
import type { IPricesCoinData, ISpecificCoinData } from "@/interfaces/systems/crypto"
import { options } from "@/api/urls/geral"
import LineChart from "@/components/Systems/Crypto/common/LineChart"
import Div from "@/components/Html/Div/Div"
import Navbar from "@/components/Systems/Crypto/partials/Navbar/Navbar"

const CoinDetail: React.FC = () => {
    const { t } = useTranslation()
    const { id } = useParams()
    const [coinData, setCoinData] = useState<ISpecificCoinData>()
    const [historicalData, setHistoricalData] = useState<IPricesCoinData>()

    const coinContext = useContext(CoinContext)
    const currency = coinContext?.currency

    const fetchCoinData = async () => {
        const data = await fetchData(`${getCoin}${id}`, options);
        setCoinData(data)
    }

    const fetchHistoricalData = async () => {
        const data = await fetchData(`${getCoin}${id}/${getMarketChart}${currency?.name}&${getDays}`, options)
        setHistoricalData(data)
    }

    useEffect(() => {
        fetchCoinData()
        fetchHistoricalData()
    }, [currency])

    if (coinData && historicalData) {
        return (
            <Div className={classes.coin}>
                <Navbar />
                <Div className={classes['coin-name']}>
                    <img src={coinData.image.large} alt={t('crypto.coinAlt')} />
                    <p><strong>{coinData.name} ({coinData.symbol.toUpperCase()})</strong></p>
                </Div>
                <Div className={classes['coin-chart']}>
                    <LineChart historicalData={historicalData} />
                </Div>
                <Div className={classes['coin-info']}>
                    <ul>
                        <li>{t('crypto.marketRank')}</li>
                        <li>{coinData.market_cap_rank}</li>
                    </ul>
                    <ul>
                        <li>{t('crypto.currentPrice')}</li>
                        <li>{currency?.symbol} {coinData.market_data.current_price[currency?.name || 'usd']?.toLocaleString()}</li>
                    </ul>
                    <ul>
                        <li>{t('crypto.high24h')}</li>
                        <li>{currency?.symbol} {coinData.market_data.high_24h[currency?.name || 'usd']?.toLocaleString()}</li>
                    </ul>
                    <ul>
                        <li>{t('crypto.low24h')}</li>
                        <li>{currency?.symbol} {coinData.market_data.low_24h[currency?.name || 'usd']?.toLocaleString()}</li>
                    </ul>
                </Div>
            </Div>
        )
    } else {
        return (
            <div className={classes.spinner}>
                <div className={classes.spin}></div>
            </div>
        )
    }

}

export default CoinDetail