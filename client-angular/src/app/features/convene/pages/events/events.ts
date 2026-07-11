import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventsIntro } from '../../components/events-intro/events-intro';
import { FindEvent } from '../../components/find-event/find-event';
import { NewEvents } from '../../components/new-events/new-events';

@Component({
  selector: 'app-events',
  imports: [RouterOutlet, EventsIntro, NewEvents, FindEvent],
  templateUrl: './events.html',
  styleUrl: './events.css',
})
export class Events {}
