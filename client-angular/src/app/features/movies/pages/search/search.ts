import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MoviesStateService } from '../../../../core/services/state/movies-state.service';
import { I18nService } from '../../../../core/services/i18n/i18n.service';

@Component({
  selector: 'app-search',
  imports: [RouterLink],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly moviesState = inject(MoviesStateService);
  readonly i18n = inject(I18nService);
  readonly fallbackPoster = 'https://i.pinimg.com/originals/ff/11/78/ff1178bf89cb845635f083aa57429c6f.jpg';

  query = '';

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.query = params.get('q') ?? '';
      if (this.query) {
        this.moviesState.searchMovies(this.query);
      }
    });
  }
}
