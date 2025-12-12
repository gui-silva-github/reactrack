import { useContext } from "react";
import { OpinionsContext } from "../../../../context/Opinly/OpinlyContext";
import Div from "../../../Html/Div/Div";
import Opinion from "../Opinion/Opinion"

import classes from "./Opinions.module.css"
import type { IOpinionData } from "../../../../interfaces/systems/opinly";
import Paragraph from "../../../Html/Paragraph/Paragraph";

const Opinions: React.FC = () => {
    const context = useContext(OpinionsContext);
    const opinions = context && 'opinions' in context ? context.opinions : null;

    return (
        <Div className={classes.opinions}>
            {
                opinions && Array.isArray(opinions) && (
                    <ul>
                        {opinions.map((opinion: IOpinionData) => (
                            <li key={opinion.id}>
                                <Opinion opinion={opinion} />
                            </li>
                        ))}
                    </ul>
                )
            }
            {opinions && Array.isArray(opinions) && opinions.length === 0 && (
                <Paragraph className={classes.none} text="Nenhuma opinião encontrada. Deseja compartilhar sua opinião sobre algo?" />
            )}
        </Div>
    )
}

export default Opinions