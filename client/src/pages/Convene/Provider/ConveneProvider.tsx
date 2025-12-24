import { Outlet } from "react-router-dom";
import Div from "../../../components/Html/Div/Div";
import './Convene.css'

const ConveneProvider: React.FC = () => {
    return (
        <Div className="body">
            <Outlet />
        </Div>
    )
} 

export default ConveneProvider