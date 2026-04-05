import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectsService, IGitHubRepo, IGitHubUser } from '../../../../core/services/projects/projects.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-projects-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="projects-home-container">
      <h1>Projetos (GitHub)</h1>
      <p>Busque um usuario e veja o perfil e os repositorios mais recentes.</p>

      <form class="search-form" (ngSubmit)="searchUser()">
        <input
          type="text"
          name="username"
          [(ngModel)]="username"
          placeholder="Digite um usuario do GitHub"
          required
        />
        <button type="submit" [disabled]="loading()">Buscar</button>
      </form>

      @if (loading()) {
        <p>Buscando usuario...</p>
      }

      @if (error()) {
        <p class="error">Usuario nao encontrado.</p>
      }

      @if (user()) {
        <article class="user-card">
          <img [src]="user()!.avatar_url" [alt]="user()!.login" />
          <div>
            <h2>{{ user()!.name || user()!.login }}</h2>
            <p>Login: {{ user()!.login }}</p>
            <p>Seguidores: {{ user()!.followers }} | Seguindo: {{ user()!.following }}</p>
            <a [href]="user()!.html_url" target="_blank" rel="noreferrer">Abrir perfil</a>
          </div>
        </article>
      }

      @if (repos().length) {
        <section class="repos-list">
          <h3>Repositorios</h3>
          @for (repo of repos(); track repo.id) {
            <a [href]="repo.html_url" target="_blank" rel="noreferrer" class="repo-item">
              <strong>{{ repo.name }}</strong>
              <span>{{ repo.language || 'N/A' }} • ⭐ {{ repo.stargazers_count }}</span>
            </a>
          }
        </section>
      }
    </section>
  `,
  styles: [`
    .projects-home-container {
      padding: 6rem 1rem 2rem;
      max-width: 900px;
      margin: 0 auto;
    }
    .search-form {
      margin: 1rem 0;
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    input, button {
      border: 1px solid #d1d5db;
      border-radius: 8px;
      padding: 0.6rem 0.8rem;
    }
    button {
      background: #2563eb;
      color: #fff;
      border: none;
      cursor: pointer;
    }
    .error {
      color: #b91c1c;
      font-weight: 600;
    }
    .user-card {
      display: flex;
      gap: 1rem;
      align-items: center;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 1rem;
    }
    .user-card img {
      width: 78px;
      height: 78px;
      border-radius: 9999px;
    }
    .repos-list {
      margin-top: 1rem;
      display: grid;
      gap: 0.6rem;
    }
    .repo-item {
      display: flex;
      justify-content: space-between;
      text-decoration: none;
      color: #111827;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 0.8rem;
      background: #fff;
    }
  `]
})
export class ProjectsHomeComponent {
  username = '';
  user = signal<IGitHubUser | null>(null);
  repos = signal<IGitHubRepo[]>([]);
  loading = signal(false);
  error = signal(false);

  constructor(
    private projectsService: ProjectsService,
    private toastService: ToastService
  ) {}

  searchUser(): void {
    const username = this.username.trim();
    if (!username) {
      return;
    }

    this.loading.set(true);
    this.error.set(false);
    this.user.set(null);
    this.repos.set([]);

    this.projectsService.getUser(username).subscribe({
      next: (user) => {
        this.user.set(user);
        this.projectsService.getUserRepos(username).subscribe({
          next: (repos) => {
            this.repos.set(repos.slice(0, 8));
            this.loading.set(false);
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Falha ao carregar repositorios.');
          }
        });
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      }
    });
  }
}










