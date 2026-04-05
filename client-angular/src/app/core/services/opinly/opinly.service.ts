import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

const OPINLY_URL = 'http://localhost:3010';

export interface IOpinion {
  id?: string;
  text: string;
  author: string;
  upvotes: number;
  downvotes: number;
  createdAt?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class OpinlyService {
  private readonly baseUrl = OPINLY_URL;

  constructor(private http: HttpClient) {}

  loadOpinions(): Observable<IOpinion[]> {
    return this.http.get<IOpinion[]>(`${this.baseUrl}/opinions`);
  }

  saveOpinion(opinion: IOpinion): Observable<IOpinion> {
    return this.http.post<IOpinion>(`${this.baseUrl}/opinions`, opinion)
  }

  upvoteOpinion(id: string): Observable<IOpinion> {
    return this.http.post<IOpinion>(`${this.baseUrl}/opinions/${id}/upvote`, {});
  }

  downvoteOpinion(id: string): Observable<IOpinion> {
    return this.http.post<IOpinion>(`${this.baseUrl}/opinions/${id}/downvote`, {});
  }
}
