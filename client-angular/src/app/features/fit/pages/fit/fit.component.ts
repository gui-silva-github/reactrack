import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FitService, IExercise } from '../../../../core/services/fit/fit.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-fit',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <section class="fit-container">
      <h1>Treinos e Exercicios</h1>
      <p>Pesquise exercicios por nome, parte do corpo ou equipamento.</p>

      <form class="search-form" (ngSubmit)="search()">
        <input
          type="text"
          name="search"
          [(ngModel)]="searchTerm"
          placeholder="Ex: squat, chest, dumbbell"
        />
        <button type="submit">Pesquisar</button>
        <button type="button" class="secondary" (click)="reset()">Limpar</button>
      </form>

      @if (loading()) {
        <p>Carregando exercicios...</p>
      } @else if (filteredExercises().length === 0) {
        <p>Nenhum exercicio encontrado.</p>
      } @else {
        <div class="grid">
          @for (exercise of filteredExercises(); track exercise.id) {
            <a [routerLink]="['/systems/fit/exercise', exercise.id]" class="exercise-card">
              <img [src]="exercise.gifUrl" [alt]="exercise.name" />
              <h2>{{ exercise.name }}</h2>
              <p>{{ exercise.bodyPart }} • {{ exercise.equipment }}</p>
            </a>
          }
        </div>
      }
    </section>
  `,
  styles: [`
    .fit-container {
      padding: 6rem 1rem 2rem;
      max-width: 1100px;
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
      border: none;
      color: #fff;
      background: #2563eb;
      cursor: pointer;
    }
    button.secondary {
      background: #4b5563;
    }
    .grid {
      display: grid;
      gap: 0.8rem;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }
    .exercise-card {
      text-decoration: none;
      color: #111827;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      overflow: hidden;
      background: #fff;
    }
    .exercise-card img {
      width: 100%;
      height: 160px;
      object-fit: cover;
      background: #f3f4f6;
    }
    .exercise-card h2 {
      font-size: 0.95rem;
      margin: 0.7rem 0.7rem 0.3rem;
      text-transform: capitalize;
    }
    .exercise-card p {
      margin: 0 0.7rem 0.8rem;
      color: #6b7280;
      text-transform: capitalize;
    }
  `]
})
export class FitComponent {
  exercises = signal<IExercise[]>([]);
  displayedExercises = signal<IExercise[]>([]);
  loading = signal(false);
  searchTerm = '';
  filteredExercises = computed(() => this.displayedExercises().slice(0, 24));

  constructor(
    private fitService: FitService,
    private toastService: ToastService
  ) {
    this.loadExercises();
  }

  loadExercises(): void {
    this.loading.set(true);
    this.fitService.getExercises().subscribe({
      next: (data) => {
        this.exercises.set(data);
        this.displayedExercises.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Erro ao carregar exercicios.');
      }
    });
  }

  search(): void {
    const query = this.searchTerm.trim().toLowerCase();
    if (!query) {
      this.displayedExercises.set(this.exercises());
      return;
    }

    this.displayedExercises.set(
      this.exercises().filter((exercise) => {
        return exercise.name.toLowerCase().includes(query) ||
          exercise.bodyPart.toLowerCase().includes(query) ||
          exercise.equipment.toLowerCase().includes(query);
      })
    );
  }

  reset(): void {
    this.searchTerm = '';
    this.displayedExercises.set(this.exercises());
  }
}










