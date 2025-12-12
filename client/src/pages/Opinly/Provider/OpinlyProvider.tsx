import { Outlet } from "react-router-dom";
import { OpinionsContextProvider } from "../../../context/Opinly/OpinlyContext";

const OpinlyProvider: React.FC = () => {

    return (
        <OpinionsContextProvider>
            <Outlet />
        </OpinionsContextProvider>
    )

}   

export default OpinlyProvider