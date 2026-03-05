import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import Icon from "../../../../assets/icons/gym.png"

import { abdominals, biceps, calves, foreArms, lats, muscleWikiUrl, quads } from "../../../../api/urls/fit";
import type { IBodyPartData } from "../../../../interfaces/systems/fit";

interface IBodyPart {
    item: IBodyPartData;
    setBodyPart: React.Dispatch<React.SetStateAction<IBodyPartData>>;
    bodyPart: IBodyPartData;
}

const BodyPart: React.FC<IBodyPart> = ({ item, setBodyPart, bodyPart }) => {
    const { t } = useTranslation()
    
    return (
        <Stack
            component="button"
            alignItems="center"
            justifyContent="center"
            className="bodyPart-card"
            sx={{
                borderTop: bodyPart.name === item.name ? '4px solid #ff2625' : '',
                backgroundColor: '#fff',
                borderBottomLeftRadius: '20px',
                width: '270px',
                height: '280px',
                cursor: 'pointer',
                gap: '47px'
            }}
            onClick={() => {
                switch (item.name) {
                  case 'chest':
                  case 'cardio':
                  case 'neck':
                  case 'shoulders':
                    window.open(`${muscleWikiUrl}${item.name}`, '_blank');
                    break;
                  case 'all':
                    window.open('https://musclewiki.com', '_blank');
                    break;
                  case 'lower legs':
                    window.open(calves, '_blank');
                    break;
                  case 'upper legs':
                    window.open(quads, '_blank');
                    break;
                  case 'lower arms':
                    window.open(foreArms, '_blank');
                    break;
                  case 'upper arms':
                    window.open(biceps, '_blank');
                    break;
                  case 'waist':
                    window.open(abdominals, '_blank');
                    break;
                  default:
                    window.open(lats, '_blank');
                }
            }}
            onMouseLeave={() => {
                setBodyPart(item)
            }}
        >
            <img src={Icon} alt={t('fit.dumbbellAlt')} style={{ width: '40px', height: '40px' }} />
            <Typography fontSize="24px" fontWeight="bold" color="#3a1212" textTransform="capitalize">
                {item.name}
            </Typography>
        </Stack>
    )

}

export default BodyPart