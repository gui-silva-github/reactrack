import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { I18nService } from '../../../../core/services/i18n/i18n.service';

@Component({
  selector: 'app-movies-navbar',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './movies-navbar.component.html',
  styleUrl: './movies-navbar.component.css',
})
export class MoviesNavbarComponent {
  readonly i18n = inject(I18nService);
  private readonly router = inject(Router);

  search = '';

  handleSubmit(event: Event): void {
    event.preventDefault();
    const query = this.search.trim();
    if (!query) return;

    this.router.navigate(['/systems/movies/search'], { queryParams: { q: query } });
    this.search = '';
  }
}
