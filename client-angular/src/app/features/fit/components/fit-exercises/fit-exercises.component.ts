import { Component, computed, effect, inject, signal } from '@angular/core';
import { I18nService } from '../../../../core/services/i18n/i18n.service';
import { FitStateService } from '../../../../core/services/state/fit-state.service';
import { ExerciseCardComponent } from '../exercise-card/exercise-card.component';
import { FitLoaderComponent } from '../fit-loader/fit-loader.component';

@Component({
  selector: 'app-fit-exercises',
  standalone: true,
  imports: [ExerciseCardComponent, FitLoaderComponent],
  templateUrl: './fit-exercises.component.html',
  styleUrl: './fit-exercises.component.css',
})
export class FitExercisesComponent {
  readonly fitState = inject(FitStateService);
  readonly i18n = inject(I18nService);

  currentPage = signal(1);
  readonly exercisesPerPage = 6;

  readonly currentExercises = computed(() => {
    const exercises = this.fitState.exercises();
    const start = (this.currentPage() - 1) * this.exercisesPerPage;
    return exercises.slice(start, start + this.exercisesPerPage);
  });

  readonly pages = computed(() => {
    const total = Math.ceil(this.fitState.exercises().length / this.exercisesPerPage);
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  constructor() {
    effect(() => {
      this.fitState.bodyPart();
      this.fitState.exercises();
      this.currentPage.set(1);
    });
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    window.scrollTo({ top: 1800, behavior: 'smooth' });
  }
}
