import { Injectable, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { IUserProps } from '../../models';
import { ProjectsService } from '../projects/projects.service';

@Injectable({ providedIn: 'root' })
export class ProjectsStateService {
  private readonly projectsService = inject(ProjectsService);

  private readonly usernameSignal = signal('');
  private readonly userSignal = signal<IUserProps | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal(false);

  readonly username = this.usernameSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  setUsername(username: string): void {
    this.usernameSignal.set(username);
  }

  searchUser(): void {
    const username = this.usernameSignal().trim();
    if (!username) return;

    this.loadingSignal.set(true);
    this.errorSignal.set(false);
    this.userSignal.set(null);

    this.projectsService
      .getUser(username)
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (data) => {
          this.userSignal.set({
            avatar_url: data.avatar_url,
            login: data.login,
            location: data.location || '',
            followers: data.followers,
            following: data.following,
          });
        },
        error: () => this.errorSignal.set(true),
      });
  }
}
