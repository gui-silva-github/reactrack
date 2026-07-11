import { Component, input, output, inject } from '@angular/core';
import { I18nService } from '../../../../core/services/i18n/i18n.service';
import { IBodyPartData } from '../../../../core/models/systems/fit/fit.model';
import { FIT_URLS } from '../../../../core/constants/api-urls';

@Component({
  selector: 'app-fit-body-part',
  standalone: true,
  templateUrl: './fit-body-part.component.html',
  styleUrl: './fit-body-part.component.css',
})
export class FitBodyPartComponent {
  readonly item = input.required<IBodyPartData>();
  readonly active = input(false);
  readonly selectPart = output<IBodyPartData>();
  readonly i18n = inject(I18nService);

  openWiki(): void {
    const name = this.item().name;
    const base = FIT_URLS.muscleWikiUrl;
    const map: Record<string, string> = {
      'lower legs': `${base}calves`,
      'upper legs': `${base}quads`,
      'lower arms': `${base}forearms`,
      'upper arms': `${base}biceps`,
      waist: `${base}abdominals`,
      all: 'https://musclewiki.com',
    };
    const url =
      map[name] ||
      (['chest', 'cardio', 'neck', 'shoulders'].includes(name) ? `${base}${name}` : `${base}lats`);
    window.open(url, '_blank');
  }
}
