import { Outlet, useLocation } from "react-router-dom"
import Div from "../../components/Html/Div/Div"
import NavbarSystems from "../../components/NavbarSystems/NavbarSystems"
import HeaderSystems from "../../components/HeaderSystems/HeaderSystems"

const SystemsLayout: React.FC = () => {

    const location = useLocation()
    const isSystemRoute = location.pathname !== '/systems' && location.pathname.startsWith('/systems/')

    return (
        <Div className={`flex flex-col items-center min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center bg-gray-50 ${!isSystemRoute ? 'justify-center' : ''}`}>
            <NavbarSystems />
            {!isSystemRoute && <HeaderSystems />}
            <Div className={isSystemRoute ? 'w-full pt-16' : ''}>
                <Outlet />
            </Div>
        </Div>
    )

} 

export default SystemsLayout