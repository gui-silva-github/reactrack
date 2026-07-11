import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { IExercisesData } from '../../../../core/models/systems/fit/fit.model';
import { FitService } from '../../../../core/services/fit/fit.service';
import { FitDetailComponent } from '../../components/fit-detail/fit-detail.component';
import { FitLoaderComponent } from '../../components/fit-loader/fit-loader.component';
import { SimilarExercisesComponent } from '../../components/similar-exercises/similar-exercises.component';

@Component({
  selector: 'app-exercise-detail',
  standalone: true,
  imports: [FitDetailComponent, SimilarExercisesComponent, FitLoaderComponent],
  template: `
    <div class="fit-page">
      @if (!exercise()) {
        <app-fit-loader />
      } @else {
        <app-fit-detail [exercise]="exercise()!" />
        <app-similar-exercises
          [targetMuscleExercises]="targetMuscleExercises()"
          [equipmentExercises]="equipmentExercises()"
        />
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class ExerciseDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly fitService = inject(FitService);

  exercise = signal<IExercisesData | null>(null);
  targetMuscleExercises = signal<IExercisesData[]>([]);
  equipmentExercises = signal<IExercisesData[]>([]);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.load(id);
  }

  load(id: string): void {
    this.fitService.getExercise(id).subscribe({
      next: (data) => {
        this.exercise.set(data);
        const requests = [];
        if (data.targetMuscles?.length) {
          requests.push(this.fitService.getSimilarExercises(data.targetMuscles.join('+')));
        }
        if (data.equipments?.length) {
          requests.push(this.fitService.getSimilarExercises(data.equipments.join('+')));
        }
        if (!requests.length) return;
        forkJoin(requests).subscribe({
          next: (results) => {
            if (data.targetMuscles?.length) this.targetMuscleExercises.set(results[0] ?? []);
            if (data.equipments?.length) {
              const index = data.targetMuscles?.length ? 1 : 0;
              this.equipmentExercises.set(results[index] ?? []);
            }
          },
        });
      },
    });
  }
}
