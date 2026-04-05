import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

const CONVENE_ENDPOINT = 'http://localhost:3003/events';
const CONVENE_IMAGES_ENDPOINT = 'http://localhost:3003/'

export interface IConveneEvent {
  id?: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  [key: string]: any;
}

export interface IConveneImage {
  id: string;
  url: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ConveneService {
  readonly eventsEndpoint = CONVENE_ENDPOINT;
  readonly imagesEndpoint = CONVENE_IMAGES_ENDPOINT;

  constructor(private http: HttpClient) {}

  getEvents(): Observable<IConveneEvent[]> {
    return this.http.get<IConveneEvent[]>(CONVENE_ENDPOINT);
  }

  getEvent(id: string): Observable<IConveneEvent> {
    return this.http.get<IConveneEvent>(`${CONVENE_ENDPOINT}/${id}`)
  }

  createEvent(event: IConveneEvent): Observable<IConveneEvent> {
    return this.http.post<IConveneEvent>(CONVENE_ENDPOINT, event);
  }

  updateEvent(id: string, event: IConveneEvent): Observable<IConveneEvent> {
    return this.http.put<IConveneEvent>(`${CONVENE_ENDPOINT}/${id}`, event);
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${CONVENE_ENDPOINT}/${id}`);
  }

  getImages(): Observable<IConveneImage[]> {
    return this.http.get<IConveneImage[]>(`${CONVENE_IMAGES_ENDPOINT}images`);
  }
}


