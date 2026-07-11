import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../../../core/services/i18n/i18n.service';
import { FitStateService } from '../../../../core/services/state/fit-state.service';
import { FitBodyPartComponent } from '../fit-body-part/fit-body-part.component';

@Component({
  selector: 'app-fit-search',
  standalone: true,
  imports: [FormsModule, FitBodyPartComponent],
  templateUrl: './fit-search.component.html',
  styleUrl: './fit-search.component.css',
})
export class FitSearchComponent {
  readonly fitState = inject(FitStateService);
  readonly i18n = inject(I18nService);

  search = '';
  private readonly scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  handleSearch(): void {
    if (!this.search) return;
    this.fitState.searchExercises(this.search.toLowerCase());
    this.search = '';
  }

  scrollLeft(): void {
    this.scrollContainer()?.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight(): void {
    this.scrollContainer()?.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }
}
