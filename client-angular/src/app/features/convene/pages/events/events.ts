import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PT } from '../../../../core/constants/i18n-pt';
import { Header } from '../../components/header/header';
import { EventsIntro } from '../../components/events-intro/events-intro';
import { FindEvent } from '../../components/find-event/find-event';
import { NewEvents } from '../../components/new-events/new-events';

@Component({
  selector: 'app-events',
  imports: [
    RouterOutlet, RouterLink, Header, EventsIntro, NewEvents, FindEvent
  ],
  templateUrl: './events.html',
  styleUrl: './events.css',
})
export class Events {
  readonly t = PT.convene;
}
