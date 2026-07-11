import { Injectable, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import {
  IBodyPartData,
  IExercisesData,
} from '../../models/systems/fit/fit.model';
import { FitService } from '../fit/fit.service';

@Injectable({ providedIn: 'root' })
export class FitStateService {
  private readonly fitService = inject(FitService);

  private readonly exercisesSignal = signal<IExercisesData[]>([]);
  private readonly bodyPartsSignal = signal<IBodyPartData[]>([]);
  private readonly bodyPartSignal = signal<IBodyPartData>({ name: 'cardio' });
  private readonly loadingSignal = signal(false);

  readonly exercises = this.exercisesSignal.asReadonly();
  readonly bodyParts = this.bodyPartsSignal.asReadonly();
  readonly bodyPart = this.bodyPartSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  constructor() {
    this.loadBodyParts();
    this.loadExercisesByBodyPart('cardio');
  }

  setBodyPart(bodyPart: IBodyPartData): void {
    this.bodyPartSignal.set(bodyPart);
    this.loadExercisesByBodyPart(bodyPart.name);
  }

  setExercises(exercises: IExercisesData[]): void {
    this.exercisesSignal.set(exercises);
  }

  loadBodyParts(): void {
    this.fitService.getBodyParts().subscribe({
      next: (data) => this.bodyPartsSignal.set(data),
      error: () => this.bodyPartsSignal.set([]),
    });
  }

  loadExercisesByBodyPart(bodyPart: string): void {
    this.loadingSignal.set(true);
    this.fitService
      .getExercisesByBodyPart(bodyPart)
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (data) => this.exercisesSignal.set(data),
        error: () => this.exercisesSignal.set([]),
      });
  }

  searchExercises(query: string): void {
    if (!query.trim()) return;
    this.loadingSignal.set(true);
    this.fitService
      .searchExercises(query)
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (data) => {
          const filtered = data.filter(
            (exercise) =>
              exercise.name.toLowerCase().includes(query) ||
              exercise.targetMuscles.some((m) => m.includes(query)) ||
              exercise.equipments.some((e) => e.includes(query)) ||
              exercise.bodyParts.some((b) => b.includes(query)) ||
              exercise.secondaryMuscles.some((s) => s.includes(query)) ||
              exercise.instructions.some((i) => i.toLowerCase().includes(query))
          );
          this.exercisesSignal.set(filtered);
        },
        error: () => this.exercisesSignal.set([]),
      });
  }
}
