import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toasts(); track toast.id) {
        <div class="toast" [class]="'toast-' + toast.type" (click)="removeToast(toast.id)">
          <span>{{ toast.message }}</span>
          <button class="toast-close" (click)="removeToast(toast.id)">×</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .toast {
      background: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-width: 300px;
      max-width: 500px;
      animation: slideIn 0.3s ease-out;
      cursor: pointer;
    }
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    .toast-success {
      border-left: 4px solid #28a745;
    }
    .toast-error {
      border-left: 4px solid #dc3545;
    }
    .toast-info {
      border-left: 4px solid #17a2b8;
    }
    .toast-warning {
      border-left: 4px solid #ffc107;
    }
    .toast-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #666;
      margin-left: 1rem;
    }
    .toast-close:hover {
      color: #000;
    }
  `]
})
export class ToastComponent {
  private toastService = inject(ToastService);
  toasts = signal(this.toastService.getToasts());

  constructor() {
    // Atualizar toasts periodicamente
    setInterval(() => {
      this.toasts.set([...this.toastService.getToasts()]);
    }, 100);
  }

  removeToast(id: number): void {
    this.toastService.remove(id);
    this.toasts.set([...this.toastService.getToasts()]);
  }
}

