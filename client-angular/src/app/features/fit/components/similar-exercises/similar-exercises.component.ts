import { Component, ElementRef, inject, input, viewChild } from '@angular/core';
import { I18nService } from '../../../../core/services/i18n/i18n.service';
import { IExercisesData } from '../../../../core/models/systems/fit/fit.model';
import { ExerciseCardComponent } from '../exercise-card/exercise-card.component';
import { FitLoaderComponent } from '../fit-loader/fit-loader.component';

@Component({
  selector: 'app-similar-exercises',
  standalone: true,
  imports: [ExerciseCardComponent, FitLoaderComponent],
  templateUrl: './similar-exercises.component.html',
  styleUrl: './similar-exercises.component.css',
})
export class SimilarExercisesComponent {
  readonly targetMuscleExercises = input<IExercisesData[]>([]);
  readonly equipmentExercises = input<IExercisesData[]>([]);
  readonly i18n = inject(I18nService);

  private readonly muscleScroll = viewChild<ElementRef<HTMLDivElement>>('muscleScroll');
  private readonly equipmentScroll = viewChild<ElementRef<HTMLDivElement>>('equipmentScroll');

  scrollMuscle(amount: number): void {
    this.muscleScroll()?.nativeElement.scrollBy({ left: amount, behavior: 'smooth' });
  }

  scrollEquipment(amount: number): void {
    this.equipmentScroll()?.nativeElement.scrollBy({ left: amount, behavior: 'smooth' });
  }
}
