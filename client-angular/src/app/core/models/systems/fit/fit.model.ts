export interface IExercisesDataAPI {
  success?: boolean;
  data: IExercisesData[];
}

export interface IExercisesData {
  exerciseId: string;
  name: string;
  gifUrl: string;
  targetMuscles: string[];
  bodyParts: string[];
  equipments: string[];
  secondaryMuscles: string[];
  instructions: string[];
}

export interface IBodyPartsDataAPI {
  success?: boolean;
  data: IBodyPartData[];
}

export interface IBodyPartData {
  name: string;
}

export interface IExerciseSearchDataAPI {
  success?: boolean;
  data: IExerciseSearchData[];
}

export interface IExerciseSearchData {
  exerciseId: string;
  name: string;
  gifUrl: string;
  targetMuscles: string[];
  bodyParts: string[];
  equipments: string[];
  secondaryMuscles: string[];
  instructions: string[];
}
