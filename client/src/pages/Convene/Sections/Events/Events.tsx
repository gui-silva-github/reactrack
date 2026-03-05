import { Link, Outlet } from "react-router-dom"
import { useTranslation } from "react-i18next"
import Header from "../../../../components/Systems/Convene/Common/Header/Header"
import EventsIntro from "../../../../components/Systems/Convene/Events/Section/EventsIntro/EventsIntro"
import FindEvent from "../../../../components/Systems/Convene/Events/Section/FindEvent/FindEvent"
import NewEvents from "../../../../components/Systems/Convene/Events/Section/NewEvents/NewEvents"

const Events: React.FC = () => {
    const { t } = useTranslation()
    return (
        <>
            <Outlet />
            <Header>
                <Link to="/systems/convene/events/new" className="button">
                    {t('convene.newEvent')}
                </Link>
            </Header>
            <main>
                <EventsIntro />
                <NewEvents />
                <FindEvent />
            </main>
        </>
    )
}

export default Events
