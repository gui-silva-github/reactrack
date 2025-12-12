import Header1 from "../../../Html/Header1/Header1"
import Paragraph from "../../../Html/Paragraph/Paragraph"
import classes from "./Header.module.css"

const Header: React.FC = () => {

    return (
        <header className={classes['main-header']}>
            <Header1 text="Opinly" className={classes.h1} />
            <Paragraph className={classes.p} text="Deposite suas opiniões aqui e elas serão guardadas!" />
        </header>
    )

}

export default Header