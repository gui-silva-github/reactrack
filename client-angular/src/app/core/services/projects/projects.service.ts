import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GITHUB_API, GITHUB_PROFILE_URL } from '../../constants/api-urls';
import { IGitHubRepo, IGitHubUser } from '../../models';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  readonly githubUrl = GITHUB_PROFILE_URL;

  constructor(private http: HttpClient) {}

  getUser(username: string): Observable<IGitHubUser> {
    return this.http.get<IGitHubUser>(`${GITHUB_API}/${username}`);
  }

  getUserRepos(username: string): Observable<IGitHubRepo[]> {
    return this.http.get<IGitHubRepo[]>(`${GITHUB_API}/${username}/repos`);
  }
}
