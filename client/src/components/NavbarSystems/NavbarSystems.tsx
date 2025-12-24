import { useContext } from "react";
import { useLocation } from "react-router-dom";
import useNavigateSPA from "../../hooks/routes/useNavigateSPA";

import { AppContext } from "../../context/AppContext";

import icon from "../../assets/jpg/icon.jpg"
import Div from "../Html/Div/Div";
import Image from "../Html/Image/Image";

const navLinks = [
    { name: "Talkive", path: "/systems/talkive" },
    { name: "Opiniões", path: "/systems/opinly" },
    { name: "Eventos", path: "/systems/convene" },
    { name: "Filmes", path: "/systems/movies" },
    { name: "Investimentos", path: "/systems/investments" },
    { name: "Projetos", path: "/systems/projects" },
    { name: "Academia", path: "/systems/fit" },
    { name: "Criptomoedas", path: "/systems/crypto" },
];

const NavbarSystems: React.FC = () => {

    const location = useLocation()
    const navigate = useNavigateSPA()

    const context = useContext(AppContext)

    if (!context) {
        throw new Error("AppContext não foi provido")
    }

    const { userData } = context

    const linkClasses = (path: string) => {
        const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
        return `text-sm font-medium px-3 py-2 rounded-md transition duration-200 
         ${isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-700 hover:bg-gray-100'}`;
    }; 
    
    const filteredNavLinks = navLinks.filter(link => {
        if (!userData && link.path === '/systems') {
            return false;
        }
        return true;
    });

    return (
        <Div className="w-full flex justify-between items-center px-4 sm:px-12 py-3 bg-white shadow-lg fixed top-0 z-50">
            <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate('/')}>
                <Image src={icon} alt="Logo ReactRack" className="w-8 h-8 rounded-full border border-gray-200" />
                <span className="text-xl font-bold text-gray-800 hidden sm:block">ReactRack</span>
            </div>
            <div className="hidden md:flex items-center space-x-1">
                {filteredNavLinks.map((link) => (
                    <a
                        key={link.path}
                        onClick={() => navigate(link.path)}
                        className={linkClasses(link.path)}
                    >
                        {link.name}
                    </a>
                ))}
            </div>
        </Div>
    )

}

export default NavbarSystems