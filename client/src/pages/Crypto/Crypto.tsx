import React, { useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import classes from "./Crypto.module.css"
import { CoinContext } from "../../context/Coin/CoinContext"
import { Link } from "react-router-dom"
import type { ICoinData } from "../../interfaces/systems/crypto"
import Div from "../../components/Html/Div/Div"
import Header1 from "../../components/Html/Header1/Header1"
import Paragraph from "../../components/Html/Paragraph/Paragraph"
import Navbar from "../../components/Systems/Crypto/partials/Navbar"

const Crypto: React.FC = () => {
    const { t } = useTranslation()
    const coinContext = useContext(CoinContext)

    const allCoin = coinContext?.allCoin;
    const currency = coinContext?.currency;

    const [displayCoin, setDisplayCoin] = useState<ICoinData[]>([])

    const [input, setInput] = useState('')

    const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput((event.target.value).toLowerCase())
        if (event.target.value === "") {
            setDisplayCoin(allCoin ?? [])
        }
    }

    const searchHandler = (event: React.FormEvent) => {
        event.preventDefault()
        const coins = allCoin?.filter((item: ICoinData) => {
            return item.name.toLowerCase().includes(input)
        })
        setDisplayCoin(coins ?? [])
    }

    useEffect(() => {
        setDisplayCoin(allCoin ?? [])
    }, [allCoin])

    return (
        <Div className={classes.home}>
            <Navbar />
            <Div className={classes.hero}>
                <Header1 text={t('crypto.title')} />
                <Paragraph text={t('crypto.subtitle')} />
                <form onSubmit={searchHandler}>
                    <input onChange={inputHandler} list="coinlist" value={input} type="text" placeholder={t('crypto.searchPlaceholder')} required />

                    <datalist id="coinlist">
                        {allCoin?.map((item: ICoinData, index: number) => (
                            <option key={index} value={item.name} />
                        ))}
                    </datalist>

                    <button type="submit">{t('crypto.search')}</button>
                </form>
            </Div>

            <Div className={classes['crypto-table']}>
                <Div className={classes['table-layout']}>
                    <p>{t('crypto.rank')}</p>
                    <p>{t('crypto.coins')}</p>
                    <p>{t('crypto.price')}</p>
                    <p style={{textAlign: 'center'}}>{t('crypto.change24h')}</p>
                    <p className={classes['market-cap']}>{t('crypto.marketCap')}</p>
                </Div>
                {
                    displayCoin.slice(0, 10).map((item: ICoinData, index: number) => (
                        <Link to={`/systems/crypto/coin/${item.id}`} className={classes['table-layout']} key={index}>
                            <p>{item.market_cap_rank}</p>
                            <Div>
                                <img src={item.image} alt={t('crypto.logoAlt')} />
                                <p>{item.name + ' - ' + item.symbol}</p>
                            </Div>
                            <p>{currency?.symbol} {item.current_price.toLocaleString()}</p>
                            <p className={item.price_change_percentage_24h > 0 ? classes.green : classes.red}>
                                {Math.floor(item.price_change_percentage_24h * 100)/100}
                            </p>
                            <p className={classes['market-cap']}>{currency?.symbol} {item.market_cap.toLocaleString()}</p>
                        </Link> 
                    ))
                }
            </Div>
        </Div>
    )

}

export default Crypto