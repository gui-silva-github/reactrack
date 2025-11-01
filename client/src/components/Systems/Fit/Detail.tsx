import { Typography, Stack, Button } from "@mui/material";
import type { IExercisesData } from "../../../interfaces/systems/fit";
import { FaDumbbell } from "react-icons/fa";
import { GiMuscleUp } from "react-icons/gi";
import { FaWeight } from "react-icons/fa";

interface IDetailProps {
    exerciseDetail: IExercisesData
}

const Detail: React.FC<IDetailProps> = ({exerciseDetail}) => {

    const { bodyParts, gifUrl, name, targetMuscles, equipments } = exerciseDetail

    const extraDetail = [
        { icon: <FaDumbbell size={50} color="#ffa9a9" />, name: bodyParts.join(', ') as string },
        { icon: <GiMuscleUp size={50} color="#ffa9a9" />, name: targetMuscles.join(', ') as string },
        { icon: <FaWeight size={50} color="#ffa9a9" />, name: equipments.join(', ') as string },
    ]

    return (
        <Stack gap="60px" sx={{flexDirection: {lg: 'row'}, p: '20px', alignItems: 'center'}}>
            <img src={gifUrl} alt={name.charAt(0).toUpperCase() + name.slice(1)} loading="lazy" className="detail-image" />
            <Stack sx={{gap: {lg: '35px', xs: '20px'}}}>
                <Typography variant="h3">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h5">
                    Exercícios mantém você forte: <span style={{ fontWeight: 'bold' }}>{name}</span> {` `}
                    é um dos melhores exercícios para {targetMuscles.join(', ')} e {equipments.join(', ')}. Ele ajuda você a melhorar seu modo e ganhar energia
                </Typography>
                {extraDetail.map((item: { icon: React.ReactNode, name: string }) => (
                    <Stack key={item.name} direction="row" gap="24px" alignItems="center" marginTop={".5rem"}>
                        <Button sx={{background: '#fff2db', borderRadius: '50%', width: '100px', height: '100px'}}>
                            {item.icon as React.ReactNode}
                        </Button>
                        <Typography textTransform="capitalize" variant="h5">
                            {item.name}
                        </Typography>
                    </Stack>
                ))}
            </Stack>
        </Stack>
    )

}

export default Detail