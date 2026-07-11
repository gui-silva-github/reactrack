import { Component, inject } from '@angular/core';
import { I18nService } from '../../../../core/services/i18n/i18n.service';

@Component({
  selector: 'app-fit-hero',
  standalone: true,
  templateUrl: './fit-hero.component.html',
})
export class FitHeroComponent {
  readonly i18n = inject(I18nService);

  gender = false;
  readonly manImg = '/assets/jpg/fit/man-fit.jpg';
  readonly womanImg = '/assets/jpg/fit/woman-fit.jpg';

  toggleGender(): void {
    this.gender = !this.gender;
  }
}
