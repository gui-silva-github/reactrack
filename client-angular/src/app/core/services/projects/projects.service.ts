import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

const GITHUB_API = 'https://api.github.com/users';

export interface IGitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  [key: string]: any;
}

export interface IGitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  readonly githubUrl = 'https://github.com/';

  constructor(private http: HttpClient) {}

  getUser(username: string): Observable<IGitHubUser> {
    return this.http.get<IGitHubUser>(`${GITHUB_API}/${username}`);
  }

  getUserRepos(username: string): Observable<IGitHubRepo[]> {
    return this.http.get<IGitHubRepo[]>(`${GITHUB_API}/${username}/repos`);
  }
}
