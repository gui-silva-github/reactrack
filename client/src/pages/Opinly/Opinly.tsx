import Div from "../../components/Html/Div/Div"
import NewOpinion from "../../components/Systems/Opinly/NewOpinion/NewOpinion"
import Opinions from "../../components/Systems/Opinly/Opinions/Opinions"
import Header from "../../components/Systems/Opinly/partials/Header"
import classes from "./Opinly.module.css"

const Opinly: React.FC = () => {

    return (
        <Div>
            <Header />
            <main className={classes.main}>
                <NewOpinion />
                <Opinions />
            </main>
        </Div>
    )

}

export default Opinly