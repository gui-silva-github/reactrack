import { Component, ViewEncapsulation } from '@angular/core';
import { FitExercisesComponent } from '../../components/fit-exercises/fit-exercises.component';
import { FitHeroComponent } from '../../components/fit-hero/fit-hero.component';
import { FitSearchComponent } from '../../components/fit-search/fit-search.component';

@Component({
  selector: 'app-fit',
  standalone: true,
  imports: [FitHeroComponent, FitSearchComponent, FitExercisesComponent],
  template: `
    <div class="fit-page">
      <app-fit-hero />
      <app-fit-search />
      <app-fit-exercises />
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class FitComponent {}
