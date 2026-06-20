import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { OPINLY_URLS } from "../../constants/api-urls";
import { IOpinionData } from "../../models";

@Injectable({ providedIn: 'root' })
export class OpinlyService {
  constructor(private http: HttpClient) {}

  loadOpinions(): Observable<IOpinionData[]> {
    return this.http.get<IOpinionData[]>(OPINLY_URLS.loadOpinions);
  }

  saveOpinion(opinion: Omit<IOpinionData, 'id'> & { id?: string }): Observable<IOpinionData> {
    return this.http.post<IOpinionData>(OPINLY_URLS.saveOpinions, opinion);
  }

  upvoteOpinion(id: string): Observable<void> {
    return this.http.post<void>(OPINLY_URLS.upvote(id), {});
  }

  downvoteOpinion(id: string): Observable<void> {
    return this.http.post<void>(OPINLY_URLS.downvote(id), {});
  }
}
