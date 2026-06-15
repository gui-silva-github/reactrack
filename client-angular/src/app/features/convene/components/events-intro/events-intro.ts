import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { PT } from '../../../../core/constants/i18n-pt';

@Component({
  selector: 'app-events-intro',
  imports: [RouterLink],
  templateUrl: './events-intro.html',
  styleUrl: './events-intro.css',
})
export class EventsIntro {
  readonly t = PT.convene;
}
