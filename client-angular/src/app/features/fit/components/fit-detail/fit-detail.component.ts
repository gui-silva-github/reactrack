import { Component, inject, input } from '@angular/core';
import { I18nService } from '../../../../core/services/i18n/i18n.service';
import { IExercisesData } from '../../../../core/models/systems/fit/fit.model';

@Component({
  selector: 'app-fit-detail',
  standalone: true,
  templateUrl: './fit-detail.component.html',
  styleUrl: './fit-detail.component.css',
})
export class FitDetailComponent {
  readonly exercise = input.required<IExercisesData>();
  readonly i18n = inject(I18nService);

  capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
