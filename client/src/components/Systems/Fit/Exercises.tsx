import { useState, useEffect, useContext } from "react";

import { Pagination } from "@mui/material";

import { Box, Stack } from "@mui/material"

import { fetchData } from "../../../utils/systems/fit";
import { AppContext } from "../../../context/AppContext";

import ExercisesCard from "./partials/ExercisesCard"
import { bodyPartSpecific } from "../../../api/urls/fit";

import type { IBodyPartData, IExercisesData, IExercisesDataAPI } from "../../../interfaces/systems/fit";

interface IExercisesProps {
    exercises: IExercisesData[];
    setExercises: React.Dispatch<React.SetStateAction<IExercisesData[]>>;
    bodyPart: IBodyPartData
}

const Exercises: React.FC<IExercisesProps> = ({ exercises, setExercises, bodyPart }) => {

    const [currentPage, setCurrentPage] = useState(1)

    const exercisesPerPage = 6

    const indexOfLastExercise = currentPage * exercisesPerPage
    const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage
    const currentExercises = Array.isArray(exercises) ? exercises.slice(indexOfFirstExercise, indexOfLastExercise) : []

    const context = useContext(AppContext)
    if (!context) {
        throw new Error("AppContext não foi provido")
    }
    const { backendUrl } = context

    const paginate = (_event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value)

        window.scrollTo({ top: 1800, behavior: 'smooth' })
    }

    useEffect(() => {
        const fetchExercisesData = async () => {
            let exercisesData: IExercisesData[] = []
            let name = bodyPart.name

            if (name) {
                const response = await fetchData(`${bodyPartSpecific}${name}/exercises`) as IExercisesDataAPI
                exercisesData = response?.data || []
            } 

            setExercises(exercisesData)
        }

        fetchExercisesData()
    }, [bodyPart.name, backendUrl])

    return (
        <Box id="exercises"
            mt="5px"
            p="20px"
        >
            <Stack direction="row" sx={{ gap: { lg: '110px', xs: '50px' } }}
                flexWrap="wrap" justifyContent="center"
            >
                {currentExercises.map((exercise: IExercisesData, index: any) => (
                    <ExercisesCard key={index} exercise={exercise} />
                ))}        
            </Stack>
            <Stack mt="100px" alignItems="center">
                {Array.isArray(exercises) && exercises.length > 6 && (
                    <Pagination 
                        color="standard"
                        shape="rounded"
                        defaultPage={1}
                        count={Math.ceil(exercises.length / exercisesPerPage)}
                        page={currentPage}
                        onChange={paginate}
                        size="large"
                    />
                )}
            </Stack>
        </Box>
    )

}

export default Exercises