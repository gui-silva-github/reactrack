import { useIsFetching } from "@tanstack/react-query";
import type { ReactNode } from "react";
import Div from "../../../../Html/Div/Div";
import classes from "./Header.module.css"

const Header: React.FC<{ children: ReactNode }> = ({ children }) => {
    const fetching = useIsFetching()

    return (
        <>
            <Div className={classes.loading}>
                { fetching > 0 && <progress /> }
            </Div>
            <header className={classes.mainHeader} id="header-title">
                <Div className={classes.headerTitle}>
                    <h1>Convene Eventos</h1>
                </Div>
                <nav className={classes.nav}>{children}</nav>
            </header>
        </>
    )
}

export default Header