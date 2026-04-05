import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ConveneService, IConveneEvent } from '../../../../core/services/convene/convene.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="edit-event-container">
      <h1>Editar Evento</h1>
      @if (loadingData()) {
        <p>Carregando evento...</p>
      } @else {
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
            <button type="submit" [disabled]="form.invalid || saving">Atualizar</button>
          </div>
        </form>
      }
    </section>
  `,
  styles: [`
    .edit-event-container {
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
export class EditEventComponent {
  event = signal<IConveneEvent | null>(null);
  loadingData = signal(false);
  saving = false;
  form: any;

  constructor(
    private route: ActivatedRoute,
    private conveneService: ConveneService,
    private fb: FormBuilder,
    private router: Router,
    private toastService: ToastService
  ) {
    this.form = this.fb.nonNullable.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required],
      image: ['']
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEvent(id);
    }
  }

  loadEvent(id: string): void {
    this.loadingData.set(true);
    this.conveneService.getEvent(id).subscribe({
      next: (data) => {
        this.event.set(data);
        this.form.patchValue({
          title: data.title,
          description: data.description,
          date: data.date,
          location: data.location,
          image: data.image ?? ''
        });
        this.loadingData.set(false);
      },
      error: () => {
        this.loadingData.set(false);
        this.toastService.error('Erro ao carregar evento.');
      }
    });
  }

  submit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id || this.form.invalid) return;

    this.saving = true;
    this.conveneService.updateEvent(id, this.form.getRawValue()).subscribe({
      next: () => {
        this.saving = false;
        this.toastService.success('Evento atualizado.');
        this.router.navigate(['/systems/convene/events', id]);
      },
      error: () => {
        this.saving = false;
        this.toastService.error('Falha ao atualizar evento.');
      }
    });
  }

  cancel(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.router.navigate(['/systems/convene/events', id]);
  }
}










