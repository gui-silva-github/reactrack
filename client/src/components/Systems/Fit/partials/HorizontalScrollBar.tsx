import { useContext } from "react";
import { useTranslation } from "react-i18next";

import { Box, Typography } from "@mui/material"

import BodyPart from "./BodyPart"

import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu"

import RightArrowImg from "../../../../assets/icons/right-arrow.png"
import LeftArrowImg from '../../../../assets/icons/left-arrow.png'

import Image from "../../../Html/Image/Image";

import ExercisesCard from "./ExercisesCard"
import type { IBodyPartData } from "../../../../interfaces/systems/fit";

const LeftArrow: React.FC = () => {
    const { scrollPrev } = useContext(VisibilityContext)
    const { t } = useTranslation()
    return (
        <Typography onClick={() => scrollPrev()} className="left-arrow">
            <Image src={LeftArrowImg} alt={t('fit.leftArrow')} />
        </Typography>
    )
}

const RightArrow: React.FC = () => {
    const { scrollNext } = useContext(VisibilityContext)
    const { t } = useTranslation()
    return (
        <Typography onClick={() => scrollNext()} className="right-arrow">
            <Image src={RightArrowImg} alt={t('fit.rightArrow')} />
        </Typography>
    )
}

interface IHorizontalScrollBar {
    data: IBodyPartData[] | any[];
    bodyParts?: IBodyPartData[];
    setBodyPart?: React.Dispatch<React.SetStateAction<IBodyPartData>>;
    bodyPart?: IBodyPartData;
}

const HorizontalScrollBar: React.FC<IHorizontalScrollBar> = ({ data, setBodyPart, bodyPart }) => {
    return (
        <Box sx={{ width: '100%', position: 'relative' }}>
            <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
                {data?.map((item: IBodyPartData | any, index: number) => (
                    <Box
                        key={item.id || item.name || item.exerciseId || index}
                        title={item.id || item.name || item.exerciseId}
                        m="0 40px"
                        sx={{ display: 'flex', flexShrink: 0 }}
                    >
                        {setBodyPart && bodyPart && item.name ? (
                            <BodyPart item={item as IBodyPartData} bodyPart={bodyPart} setBodyPart={setBodyPart} />
                        ) : (
                            <ExercisesCard exercise={item} />
                        )}
                    </Box>
                ))}
            </ScrollMenu>
        </Box>
    )
}

export default HorizontalScrollBar

