import { Outlet } from "react-router-dom"
import CoinContextProvider from "../../../context/Coin/CoinContext"

const CoinProvider: React.FC = () => {

    return (
        <CoinContextProvider>
            <Outlet />
        </CoinContextProvider>
    )

} 

export default CoinProvider