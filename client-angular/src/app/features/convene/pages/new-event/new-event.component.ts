import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConveneService } from '../../../../core/services/convene/convene.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-new-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="new-event-container">
      <h1>Novo Evento</h1>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>Título</label>
        <input type="text" formControlName="title" />

        <label>Descrição</label>
        <textarea formControlName="description"></textarea>

        <label>Local</label>
        <input type="text" formControlName="location" />

        <label>Data</label>
        <input type="date" formControlName="date" />

        <label>URL da imagem (opcional)</label>
        <input type="text" formControlName="image" />

        <div class="actions">
          <button type="button" class="secondary" (click)="cancel()">Cancelar</button>
          <button type="submit" [disabled]="form.invalid || loading">Criar</button>
        </div>
      </form>
    </section>
  `,
  styles: [`
    .new-event-container {
      margin-bottom: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      background: #fff;
      padding: 1rem;
    }
    form {
      display: grid;
      gap: 0.5rem;
    }
    input, textarea {
      border: 1px solid #d1d5db;
      border-radius: 8px;
      padding: 0.55rem;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    button {
      border: none;
      border-radius: 8px;
      background: #2563eb;
      color: #fff;
      padding: 0.5rem 0.8rem;
      cursor: pointer;
    }
    button.secondary {
      background: #6b7280;
    }
  `]
})
export class NewEventComponent {
  loading = false;
  form: any;

  constructor(
    private readonly fb: FormBuilder,
    private readonly conveneService: ConveneService,
    private readonly router: Router,
    private readonly toastService: ToastService
  ) {
    this.form = this.fb.nonNullable.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required],
      image: ['']
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.conveneService.createEvent(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading = false;
        this.toastService.success('Evento criado com sucesso.');
        this.router.navigate(['/systems/convene/events']);
      },
      error: () => {
        this.loading = false;
        this.toastService.error('Falha ao criar evento.');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/systems/convene/events']);
  }
}










