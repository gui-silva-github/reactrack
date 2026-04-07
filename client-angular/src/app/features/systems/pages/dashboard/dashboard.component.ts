import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface SystemCard {
  title: string;
  path: string;
}

@Component({
  selector: 'app-systems-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="dashboard">
      <h1>Dashboard</h1>
      <p class="subtitle">Escolha um sistema para começar</p>

      <div class="grid">
        @for (system of systems; track system.path) {
          <a [routerLink]="system.path" class="card">
            <span class="title">{{ system.title }}</span>
          </a>
        }
      </div>
    </section>
  `,
  styles: [`
    .dashboard {
      width: min(1100px, 100%);
      margin: 0 auto;
      padding: 6rem 1rem 2rem;
      text-align: center;
    }
    .subtitle {
      color: #4b5563;
      margin: 0 0 2rem;
    }
    .grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }
    .card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 5rem;
      text-decoration: none;
      color: #111827;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 1.5rem 1rem;
      transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
    }
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
      border-color: #d1d5db;
    }
    .title {
      font-weight: 600;
      font-size: 1.125rem;
    }
    h1 {
      margin: 0 0 0.5rem;
      font-size: clamp(1.5rem, 2vw, 1.875rem);
      font-weight: 700;
      color: #1f2937;
    }
  `]
})
export class SystemsDashboardComponent {
  readonly systems: SystemCard[] = [
    { title: 'Talkive', path: '/systems/talkive' },
    { title: 'Opiniões', path: '/systems/opinly' },
    { title: 'Eventos', path: '/systems/convene' },
    { title: 'Filmes', path: '/systems/movies' },
    { title: 'Investimentos', path: '/systems/investments' },
    { title: 'Projetos', path: '/systems/projects' },
    { title: 'Academia', path: '/systems/fit' },
    { title: 'Criptomoedas', path: '/systems/crypto' },
  ];
}
