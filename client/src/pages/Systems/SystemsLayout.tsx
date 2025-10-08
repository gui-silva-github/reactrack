import Div from "../../components/Html/Div/Div"
import NavbarSystems from "../../components/NavbarSystems/NavbarSystems"
import HeaderSystems from "../../components/HeaderSystems/HeaderSystems"

const SystemsLayout: React.FC = () => {

    return (
        <Div className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
            <NavbarSystems />
            <HeaderSystems />
        </Div>
    )

} 

export default SystemsLayout