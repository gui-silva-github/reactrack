import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MoviesNavbarComponent } from '../components/movies-navbar/movies-navbar.component';

@Component({
  selector: 'app-movies-layout',
  standalone: true,
  imports: [RouterOutlet, MoviesNavbarComponent],
  template: `
    <div class="movies-shell">
      <app-movies-navbar />
      <router-outlet />
    </div>
  `,
  styleUrl: './movies-layout.css',
})
export class MoviesLayout {}
