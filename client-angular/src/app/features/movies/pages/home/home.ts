import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MoviesStateService } from '../../../../core/services/state/movies-state.service';
import { I18nService } from '../../../../core/services/i18n/i18n.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  readonly moviesState = inject(MoviesStateService);
  readonly i18n = inject(I18nService);
  readonly fallbackPoster = 'https://i.pinimg.com/originals/ff/11/78/ff1178bf89cb845635f083aa57429c6f.jpg';

  ngOnInit(): void {
    this.moviesState.loadTopRated();
  }
}
