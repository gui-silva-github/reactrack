import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface SystemCard {
  title: string;
  description: string;
  path: string;
}

@Component({
  selector: 'app-systems-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="dashboard">
      <h1>Sistemas do Reactrack</h1>
      <p>Escolha um sistema para continuar.</p>

      <div class="grid">
        @for (system of systems; track system.path) {
          <a [routerLink]="system.path" class="card">
            <h2>{{ system.title }}</h2>
            <p>{{ system.description }}</p>
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
    .grid {
      margin-top: 1.5rem;
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }
    .card {
      display: block;
      text-decoration: none;
      color: #111827;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 1rem;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    }
    h2 {
      margin: 0 0 0.5rem;
      font-size: 1rem;
    }
    p {
      margin: 0;
      color: #4b5563;
      font-size: 0.9rem;
    }
  `]
})
export class SystemsDashboardComponent {
  readonly systems: SystemCard[] = [
    { title: 'Caixa', description: 'Abertura, movimentos e fechamento com conferencia cega.', path: '/systems/cash-register' },
    { title: 'Criptomoedas', description: 'Acompanhe mercado e detalhes de moedas.', path: '/systems/crypto' },
    { title: 'Projetos', description: 'Busque usuarios e repositorios no GitHub.', path: '/systems/projects' },
    { title: 'Academia', description: 'Pesquise exercicios e veja detalhes.', path: '/systems/fit' },
    { title: 'Opinly', description: 'Sistema de opinioes.', path: '/systems/opinly' },
    { title: 'Talkive', description: 'Chat em tempo real.', path: '/systems/talkive' },
    { title: 'Filmes', description: 'Busca e exploracao de filmes.', path: '/systems/movies' },
    { title: 'Eventos', description: 'Gerenciamento de eventos.', path: '/systems/convene' },
    { title: 'Investimentos', description: 'Simulador e calculos financeiros.', path: '/systems/investments' }
  ];
}








