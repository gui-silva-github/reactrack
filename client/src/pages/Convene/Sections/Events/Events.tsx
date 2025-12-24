import { Link, Outlet } from "react-router-dom"
import Header from "../../../../components/Systems/Convene/Common/Header/Header"
import EventsIntro from "../../../../components/Systems/Convene/Events/Section/EventsIntro/EventsIntro"
import FindEvent from "../../../../components/Systems/Convene/Events/Section/FindEvent/FindEvent"
import NewEvents from "../../../../components/Systems/Convene/Events/Section/NewEvents/NewEvents"

const Events: React.FC = () => {
    return (
        <>
            <Outlet />
            <Header>
                <Link to="/systems/convene/events/new" className="button">
                    Novo Evento
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
