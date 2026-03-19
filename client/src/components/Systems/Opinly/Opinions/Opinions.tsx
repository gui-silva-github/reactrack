import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { OpinionsContext } from "@/context/Opinly/OpinlyContext";
import Div from "@/components/Html/Div/Div";
import Opinion from "../Opinion/Opinion"
import classes from "./Opinions.module.css"
import type { IOpinionData } from "@/interfaces/systems/opinly";
import Paragraph from "@/components/Html/Paragraph/Paragraph";

const Opinions: React.FC = () => {
    const { t } = useTranslation()
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
                <Paragraph className={classes.none} text={t('opinly.noOpinions')} />
            )}
        </Div>
    )
}

export default Opinions