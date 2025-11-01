import { useEffect, useState, useContext } from "react";

import { useParams } from "react-router-dom";

import { fetchData } from "../../utils/systems/fit";
import { AppContext } from "../../context/AppContext";

import Detail from "../../components/Systems/Fit/Detail"
import SimilarExercises from "../../components/Systems/Fit/partials/SimilarExercises"

import { Box } from "@mui/material";

import { exerciseSpecific, similarExercises } from "../../api/urls/fit";
import type { IExercisesData } from "../../interfaces/systems/fit";
import Loader from "../../components/Systems/Fit/common/Loader";

const ExerciseDetail: React.FC = () => {

    const [exerciseDetail, setExerciseDetail] = useState<IExercisesData>()
    const [targetMuscleExercises, setTargetMuscleExercises] = useState<IExercisesData[]>([])
    const [equipmentExercises, setEquipmentExercises] = useState<IExercisesData[]>([])

    const { id } = useParams()
    
    const context = useContext(AppContext)
    if (!context) {
        throw new Error("AppContext não foi provido")
    }
    const { backendUrl } = context

    useEffect(() => {

        const fetchExercisesData = async () => {

            const exerciseDetailData = await fetchData(`${exerciseSpecific}${id}`)
            
            const exerciseData: IExercisesData = (exerciseDetailData as any)?.data || exerciseDetailData as IExercisesData
            
            if (!exerciseData) {
                return
            }
            
            setExerciseDetail(exerciseData)

            if (exerciseData.targetMuscles && Array.isArray(exerciseData.targetMuscles) && exerciseData.targetMuscles.length > 0) {
                const similarExercisesMuscleData = await fetchData(`${similarExercises}${exerciseData.targetMuscles.join('+')}`)
                const muscleExercises = (similarExercisesMuscleData as any)?.data || similarExercisesMuscleData
                setTargetMuscleExercises(Array.isArray(muscleExercises) ? (muscleExercises as IExercisesData[]) : [])
            }

            if (exerciseData.equipments && Array.isArray(exerciseData.equipments) && exerciseData.equipments.length > 0) {
                const similarExercisesEquipmentData = await fetchData(`${similarExercises}${exerciseData.equipments.join('+')}`)

                const equipmentExercises = (similarExercisesEquipmentData as any)?.data || similarExercisesEquipmentData
                setEquipmentExercises(Array.isArray(equipmentExercises) ? (equipmentExercises as IExercisesData[]) : [])
            }

        }

        fetchExercisesData()

    }, [id, backendUrl])

    if (!exerciseDetail || !exerciseDetail?.name) {
        return <Loader />
    }
    
    return (
        <Box>
            <Detail exerciseDetail={exerciseDetail} />
            <SimilarExercises targetMuscleExercises={targetMuscleExercises} equipmentExercises={equipmentExercises} />
        </Box>
    )
}

export default ExerciseDetail
