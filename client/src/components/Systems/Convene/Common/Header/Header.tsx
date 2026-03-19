import { useIsFetching } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";
import Div from "@/components/Html/Div/Div";
import classes from "./Header.module.css"

const Header: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { t } = useTranslation()
    const fetching = useIsFetching()

    return (
        <>
            <Div className={classes.loading}>
                { fetching > 0 && <progress /> }
            </Div>
            <header className={classes.mainHeader} id="header-title">
                <Div className={classes.headerTitle}>
                    <h1>{t('convene.headerTitle')}</h1>
                </Div>
                <nav className={classes.nav}>{children}</nav>
            </header>
        </>
    )
}

export default Header