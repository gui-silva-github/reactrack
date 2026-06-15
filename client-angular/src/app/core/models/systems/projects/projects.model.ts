export interface IUserProps {
  avatar_url: string;
  login: string;
  location: string;
  followers: number;
  following: number;
}

export interface IGitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string;
  bio: string;
  location?: string;
  public_repos: number;
  followers: number;
  following: number;
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
}
