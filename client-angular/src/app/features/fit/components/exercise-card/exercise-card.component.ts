import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IExercisesData } from '../../../../core/models/systems/fit/fit.model';

@Component({
  selector: 'app-exercise-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './exercise-card.component.html',
  styleUrl: './exercise-card.component.css',
})
export class ExerciseCardComponent {
  readonly exercise = input.required<IExercisesData>();
}
