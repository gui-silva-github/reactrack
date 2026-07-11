import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { FIT_URLS } from '../../constants/api-urls';
import {
  IBodyPartData,
  IBodyPartsDataAPI,
  IExerciseSearchData,
  IExerciseSearchDataAPI,
  IExercisesData,
  IExercisesDataAPI,
} from '../../models/systems/fit/fit.model';

@Injectable({ providedIn: 'root' })
export class FitService {
  readonly muscleWikiUrl = FIT_URLS.muscleWikiUrl;

  constructor(private http: HttpClient) {}

  getBodyParts(): Observable<IBodyPartData[]> {
    return this.http
      .get<IBodyPartsDataAPI>(FIT_URLS.bodyPartList)
      .pipe(map((response) => response.data ?? []));
  }

  getExercises(): Observable<IExercisesData[]> {
    return this.http
      .get<IExercisesDataAPI>(FIT_URLS.exercisesList)
      .pipe(map((response) => response.data ?? []));
  }

  getExercisesByBodyPart(bodyPart: string): Observable<IExercisesData[]> {
    return this.http
      .get<IExercisesDataAPI>(`${FIT_URLS.bodyPartSpecific}${bodyPart}`)
      .pipe(map((response) => response.data ?? []));
  }

  searchExercises(query: string): Observable<IExerciseSearchData[]> {
    const params = new HttpParams().set('search', query);
    return this.http
      .get<IExerciseSearchDataAPI>(FIT_URLS.exercisesList, { params })
      .pipe(map((response) => response.data ?? []));
  }

  getExercise(id: string): Observable<IExercisesData> {
    return this.http.get<IExercisesData>(`${FIT_URLS.exerciseSpecific}${id}`);
  }

  getExercisesByTarget(target: string): Observable<IExercisesData[]> {
    return this.http
      .get<IExercisesDataAPI>(`${FIT_URLS.targetMuscle}${target}`)
      .pipe(map((response) => response.data ?? []));
  }

  getExercisesByEquipment(equipment: string): Observable<IExercisesData[]> {
    return this.http
      .get<IExercisesDataAPI>(`${FIT_URLS.equipment}${equipment}`)
      .pipe(map((response) => response.data ?? []));
  }

  getSimilarExercises(query: string): Observable<IExerciseSearchData[]> {
    const params = new HttpParams().set('q', query);
    return this.http
      .get<IExerciseSearchDataAPI>(FIT_URLS.similarExercises, { params })
      .pipe(map((response) => response.data ?? []));
  }
}
