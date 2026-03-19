import { Link } from "react-router-dom";
import { Button, Stack, Typography } from "@mui/material";
import type { IExercisesData } from "@/interfaces/systems/fit";

interface IExerciseCard {
    exercise: IExercisesData
}

const ExercisesCard: React.FC<IExerciseCard> = ({ exercise }) => {

    return (
        <Link className="exercise-card" to={`/systems/fit/exercise/${exercise.exerciseId}`}>
            <img src={exercise.gifUrl} alt={exercise.name} loading="lazy" />
            <Stack direction='row'>
                <Button sx={{ ml: '21px', color: '#fff', background: '#ffa9a9', fontSize: '14px', borderRadius: '20px', textTransform: 'capitalize' }}>
                    {exercise.bodyParts}
                </Button>
                <Button sx={{ ml: '21px', color: '#fff', background: '#fcc757', fontSize: '14px', borderRadius: '20px', textTransform: 'capitalize' }}>
                    {exercise.targetMuscles}
                </Button>
            </Stack>
            <Typography
                ml="21px" color="#000" fontWeight="bold" mt="11px" pb="10px"
                textTransform="capitalize" fontSize="22px">
                {exercise.name}
            </Typography>
        </Link>
    )

}

export default ExercisesCard