import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MoviesStateService } from '../../../../core/services/state/movies-state.service';

@Component({
  selector: 'app-movie',
  imports: [CommonModule, RouterLink],
  templateUrl: './movie.html',
  styleUrl: './movie.css',
})
export class Movie implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly moviesState = inject(MoviesStateService);
  readonly fallbackPoster = 'https://i.pinimg.com/originals/ff/11/78/ff1178bf89cb845635f083aa57429c6f.jpg';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.moviesState.loadMovie(+id);
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }
}
