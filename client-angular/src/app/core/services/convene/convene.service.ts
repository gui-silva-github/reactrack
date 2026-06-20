import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CONVENE_URL, CONVENE_URLS } from '../../constants/api-urls';
import { IConveneEventPayload } from '../../models';
import { ConveneImage } from '../../models';

interface FetchEventsOptions {
  searchTerm?: string;
  max?: number;
}

@Injectable({ providedIn: 'root' })
export class ConveneService {
  readonly eventsEndpoint = CONVENE_URLS.events;
  readonly imagesEndpoint = `${CONVENE_URL}/`;

  constructor(private http: HttpClient) {}

  getEvents(options: FetchEventsOptions = {}): Observable<IConveneEventPayload[]> {
    let params = new HttpParams();
    if (options.searchTerm) params = params.set('search', options.searchTerm);
    if (options.max !== undefined) params = params.set('max', options.max.toString());

    return this.http
      .get<{ events: IConveneEventPayload[] }>(CONVENE_URLS.events, { params })
      .pipe(map((response) => response.events ?? []));
  }

  getEvent(id: string): Observable<IConveneEventPayload> {
    return this.http
      .get<{ event: IConveneEventPayload }>(CONVENE_URLS.event(id))
      .pipe((map((response) => response.event)));
  }

  createEvent(event: IConveneEventPayload): Observable<IConveneEventPayload> {
    return this.http
      .post<{ event: IConveneEventPayload }>(CONVENE_URLS.events, { event })
      .pipe(map((response) => response.event));
  }

  updateEvent(id: string, event: IConveneEventPayload): Observable<IConveneEventPayload> {
    return this.http
      .put<{ event: IConveneEventPayload }>(CONVENE_URLS.event(id), { event })
      .pipe(map((response) => response.event));
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(CONVENE_URLS.event(id));
  }

  getImages(): Observable<ConveneImage[]> {
    return this.http
      .get<{ images: ConveneImage[] }>(CONVENE_URLS.images)
      .pipe(map((response) => response.images ?? []));
  }
}
