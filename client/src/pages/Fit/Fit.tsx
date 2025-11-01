import { useState } from "react"
import { Box } from "@mui/material"

import HeroBanner from "../../components/Systems/Fit/partials/HeroBanner"
import SearchExercises from "../../components/Systems/Fit/SearchExercises"
import Exercises from "../../components/Systems/Fit/Exercises"

import type { IBodyPartData, IExercisesData } from "../../interfaces/systems/fit"

const Fit: React.FC = () => {

    const [bodyPart, setBodyPart] = useState<IBodyPartData>({ name: 'cardio' })

    const [exercises, setExercises] = useState<IExercisesData[]>([])

    return (
        <Box>
            <HeroBanner />
            <SearchExercises
                setExercises={setExercises}
                bodyPart={bodyPart}
                setBodyPart={setBodyPart}
            />
            <Exercises 
                exercises={exercises}
                setExercises={setExercises}
                bodyPart={bodyPart}
            />
        </Box>
    )
}

export default Fit