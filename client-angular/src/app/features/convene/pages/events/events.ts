import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { EventsIntro } from '../../components/events-intro/events-intro';
import { FindEvent } from '../../components/find-event/find-event';
import { Header } from '../../components/header/header';
import { NewEvents } from '../../components/new-events/new-events';
import { ConveneI18n } from '../../convene-i18n';

@Component({
  selector: 'app-events',
  imports: [RouterOutlet, Header, EventsIntro, NewEvents, FindEvent, RouterLink],
  templateUrl: './events.html',
  styleUrl: './events.css',
})
export class Events {
  readonly t = inject(ConveneI18n);
}
