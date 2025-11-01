import React, { useEffect, useState, useContext } from "react";

import { Box, Button, Stack, TextField, Typography } from "@mui/material"

import { fetchData } from "../../../utils/systems/fit";
import { AppContext } from "../../../context/AppContext";

import HorizontalScrollBar from "./partials/HorizontalScrollBar"
import { bodyPartList, searchExercise } from "../../../api/urls/fit";
import type { IBodyPartData, IBodyPartsDataAPI, IExerciseSearchDataAPI, IExercisesData } from "../../../interfaces/systems/fit";
import { toast } from "react-toastify";

interface ISearchExercisesProps {
    setExercises: React.Dispatch<React.SetStateAction<IExercisesData[]>>;
    bodyPart: IBodyPartData,
    setBodyPart: React.Dispatch<React.SetStateAction<IBodyPartData>>;
}

const SearchExercises: React.FC<ISearchExercisesProps> = ({ setExercises, bodyPart, setBodyPart }) => {
    const [search, setSearch] = useState<string>('')
    const [bodyParts, setBodyParts] = useState<IBodyPartData[]>([])

    const context = useContext(AppContext)
    if (!context) {
        throw new Error("AppContext não foi provido")
    }

    useEffect(() => {
        const fetchExercisesData = async () => {
            try {
                const bodyPartsData: IBodyPartsDataAPI = await fetchData(bodyPartList)

                setBodyParts(bodyPartsData.data);
            } catch (error) {
                toast.error('Erro ao retornar dados da API ExerciseDB!')
                setBodyParts([]);
            }
        }

        fetchExercisesData()
    }, [])

    const handleSearch = async () => {
        if (search) {
            const exercisesData: IExerciseSearchDataAPI = await fetchData(`${searchExercise}${search}`)

            const searchedExercises = exercisesData.data.filter(
                (exercise: IExercisesData) =>
                    exercise.name.toLowerCase().includes(search)
                    ||
                    exercise.targetMuscles.includes(search.toLowerCase())
                    ||
                    exercise.equipments.includes(search.toLowerCase())
                    ||
                    exercise.bodyParts.includes(search.toLowerCase())
                    ||
                    exercise.secondaryMuscles.includes(search.toLowerCase())
                    ||
                    exercise.instructions.includes(search.toLowerCase())
            )

            setSearch('')
            setExercises(searchedExercises)
        }
    }

    return (
        <Stack alignItems="center" mt="6rem" justifyContent="center" p="20px">
            <Typography fontWeight={700} sx={{
                fontSize: { lg: '44px', xs: '30px' }
            }}
                mb="50px" textAlign="center">
                Exercícios Incríveis que <br /> você precisa conhecer
            </Typography>
            <Box position="relative" mb="36px">
                <TextField
                    sx={{
                        input: {
                            fontWeight: '700',
                            border: 'none',
                            borderRadius: '4px'
                        },
                        width: { lg: '800px', xs: '350px' },
                        backgroundColor: '#fff',
                        borderRadius: '40px'
                    }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value.toLowerCase())}
                    placeholder="Procure Exercícios"
                    type="text"
                />
                <Button className="search-btn"
                    sx={{
                        bgcolor: "#ff2625",
                        color: "#fff",
                        textTransform: "none",
                        width: { lg: '175px', xs: '80px' },
                        fontSize: { lg: '16px', xs: '14px' },
                        height: '56px',
                        position: 'absolute',
                        right: "0"
                    }}
                    onClick={handleSearch}
                >
                    Procurar
                </Button>
            </Box>
            <Box sx={{ position: 'relative', width: '100%', p: '20px' }}>
                <HorizontalScrollBar data={bodyParts} bodyParts={bodyParts} setBodyPart={setBodyPart} bodyPart={bodyPart} />
            </Box>
        </Stack>
    )
}

export default SearchExercises