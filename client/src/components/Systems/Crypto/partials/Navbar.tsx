import { useContext } from "react"
import classes from './Navbar.module.css'
import { CoinContext } from "../../../../context/Coin/CoinContext"
import { Link } from "react-router-dom"
import logo from "../../../../assets/png/crypto/logo.png"
import Image from "../../../Html/Image/Image"

const Navbar: React.FC = () => {

    const coinContext = useContext(CoinContext);

    if (!coinContext) {
        return null;
    }

    const { currency, setCurrency } = coinContext;

    const currencyHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        switch (event.target.value) {
            case 'usd':
                setCurrency({ name: 'usd', symbol: '$' })
                break
            case 'eur':
                setCurrency({ name: 'eur', symbol: '€' })
                break
            case 'brl':
                setCurrency({ name: 'brl', symbol: 'R$' })
                break
            case 'inr':
                setCurrency({ name: 'inr', symbol: '₹' })
                break
            default:
                setCurrency({ name: 'usd', symbol: '$' })
        }
    }

    return (
        <div className={classes.navbar}>
            <ul>
                <Link to="/systems/crypto">
                    <Image src={logo} alt="Mercado de Crypto" />
                </Link>
            </ul>
            <div className={classes['nav-right']}>
                <select onChange={currencyHandler} defaultValue={currency?.name}>
                    <option value="usd">USD ($)</option>
                    <option value="eur">EUR (€)</option>
                    <option value="brl">BRL (R$)</option>
                    <option value="inr">INR (₹)</option>
                </select>
            </div>
        </div>
    )
}

export default Navbar