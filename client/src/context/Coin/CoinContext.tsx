import { createContext, useEffect, useState } from "react";
import { fetchData } from "@/utils/systems/fit";
import { getCurrency } from "@/api/urls/coin";
import type { ICurrency } from "@/interfaces/systems/crypto";
import type { ICoinContext } from "@/interfaces/context/coin";

export const CoinContext = createContext<ICoinContext | null>(null)

const CoinContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [allCoin, setAllCoin] = useState([])
    const [currency, setCurrency] = useState<ICurrency>({
        name: 'usd',
        symbol: '$'
    })

    const fetchAllCoin = async () => {
        const options = {
            method: 'GET',
            headers: { accept: 'application/json' }
        }

        const data = await fetchData(`${getCurrency}${currency.name}`, options)

        setAllCoin(data)
    }

    useEffect(() => {
        fetchAllCoin()
    }, [currency])

    const contextValue = {
        allCoin, currency, setCurrency
    }

    return (
        <CoinContext.Provider value={contextValue}>
            {children}
        </CoinContext.Provider>
    )

}

export default CoinContextProvider