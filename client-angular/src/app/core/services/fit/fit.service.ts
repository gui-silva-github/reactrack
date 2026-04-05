import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

const EXERCISE_DB_URL = 'https://www.exercisedb.dev/api/v1';
const MUSCLE_WIKI_URL = 'https://musclewiki.com/exercises/male';

export interface IExercise {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string;
  instructions: string[];
  [key: string]: any;
}

export interface IBodyPart {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class FitService {
  readonly muscleWikiUrl = MUSCLE_WIKI_URL;

  constructor(private http: HttpClient) {}

  getBodyParts(): Observable<IBodyPart[]> {
    return this.http.get<IBodyPart[]>(`${EXERCISE_DB_URL}/bodyparts`);
  }

  getExercises(): Observable<IExercise[]> {
    return this.http.get<IExercise[]>(`${EXERCISE_DB_URL}/exercises`);
  }

  getExercisesByBodyPart(bodyPart: string): Observable<IExercise[]> {
    return this.http.get<IExercise[]>(`${EXERCISE_DB_URL}/bodyparts/${bodyPart}`);
  }

  searchExercises(query: string): Observable<IExercise[]> {
    const params = new HttpParams().set('search', query);
    return this.http.get<IExercise[]>(`${EXERCISE_DB_URL}/exercises`, { params });
  }

  getExercise(id: string): Observable<IExercise> {
    return this.http.get<IExercise>(`${EXERCISE_DB_URL}/exercises/${id}`);
  }

  getExercisesByTarget(target: string): Observable<IExercise[]> {
    return this.http.get<IExercise[]>(`${EXERCISE_DB_URL}/muscles/${target}`);
  }

  getExercisesByEquipment(equipment: string): Observable<IExercise[]> {
    return this.http.get<IExercise[]>(`${EXERCISE_DB_URL}/equipments/${equipment}`);
  }

  getSimilarExercises(query: string): Observable<IExercise[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<IExercise[]>(`${EXERCISE_DB_URL}/exercises/search`, { params });
  }
}
