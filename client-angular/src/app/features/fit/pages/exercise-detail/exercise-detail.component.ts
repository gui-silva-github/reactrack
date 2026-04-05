import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FitService, IExercise } from '../../../../core/services/fit/fit.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-exercise-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="exercise-detail-container">
      <a routerLink="/systems/fit" class="back-link">← Voltar para exercicios</a>

      @if (loading()) {
        <p>Carregando exercicio...</p>
      } @else if (!exercise()) {
        <p>Exercicio nao encontrado.</p>
      } @else {
        <div class="content">
          <img [src]="exercise()!.gifUrl" [alt]="exercise()!.name" />
          <div>
            <h1>{{ exercise()!.name }}</h1>
            <p><strong>Body part:</strong> {{ exercise()!.bodyPart }}</p>
            <p><strong>Target:</strong> {{ exercise()!.target }}</p>
            <p><strong>Equipamento:</strong> {{ exercise()!.equipment }}</p>
            @if (exercise()!.instructions.length) {
              <h3>Instrucoes</h3>
              <ol>
                @for (step of exercise()!.instructions; track step) {
                  <li>{{ step }}</li>
                }
              </ol>
            }
          </div>
        </div>
      }
    </section>
  `,
  styles: [`
    .exercise-detail-container {
      padding: 6rem 1rem 2rem;
      max-width: 980px;
      margin: 0 auto;
    }
    .back-link {
      color: #2563eb;
      text-decoration: none;
      display: inline-block;
      margin-bottom: 1rem;
    }
    .content {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 1rem;
      align-items: start;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 1rem;
    }
    img {
      width: 100%;
      border-radius: 10px;
      background: #f3f4f6;
    }
    h1 {
      text-transform: capitalize;
      margin-top: 0;
    }
    p {
      text-transform: capitalize;
    }
    @media (max-width: 800px) {
      .content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ExerciseDetailComponent {
  exercise = signal<IExercise | null>(null);
  loading = signal(false);

  constructor(
    private route: ActivatedRoute,
    private fitService: FitService,
    private toastService: ToastService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadExercise(id);
    }
  }

  loadExercise(id: string): void {
    this.loading.set(true);
    this.fitService.getExercise(id).subscribe({
      next: (data) => {
        this.exercise.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Erro ao carregar exercicio.');
      }
    });
  }
}










