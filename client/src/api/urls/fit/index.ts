import { exerciseDbUrl } from "../geral"

// exercise API

export const bodyPartList: string = `${exerciseDbUrl}/bodyparts`

export const exercisesList: string = `${exerciseDbUrl}/exercises`

export const bodyPartSpecific: string = `${exerciseDbUrl}/bodyparts/`

export const searchExercise: string = `${exerciseDbUrl}/exercises?&search=`

export const exerciseSpecific: string = `${exerciseDbUrl}/exercises/`

export const targetMuscle: string = `${exerciseDbUrl}/muscles/`

export const equipment: string = `${exerciseDbUrl}/equipments/`

export const similarExercises: string = `${exerciseDbUrl}/exercises/search?q=`

// muscle wiki

export const muscleWikiUrl: string = 'https://musclewiki.com/exercises/male/'

export const calves: string = `${muscleWikiUrl}calves`

export const quads: string = `${muscleWikiUrl}quads`

export const foreArms: string = `${muscleWikiUrl}forearms`

export const biceps: string = `${muscleWikiUrl}biceps`

export const abdominals: string = `${muscleWikiUrl}abdominals`

export const lats: string = `${muscleWikiUrl}lats`
