import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConveneI18n } from '../../convene-i18n';

@Component({
  selector: 'app-events-intro',
  imports: [RouterLink],
  templateUrl: './events-intro.html',
  styleUrl: './events-intro.css',
})
export class EventsIntro {
  readonly t = inject(ConveneI18n);
}
