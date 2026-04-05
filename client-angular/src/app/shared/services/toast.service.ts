import { Injectable, signal } from "@angular/core";

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = signal<Toast[]>([]);
  private toastIdCounter = 0;

  getToasts(): Toast[] {
    return this.toasts();
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }

  private show(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    const id = this.toastIdCounter++;
    this.toasts.update(toasts => [...toasts, { message, type, id }]);

    setTimeout(() => {
      this.remove(id);
    }, 5000);
  }

  remove(id: number): void {
    this.toasts.update(toasts => toasts.filter(toast => toast.id !== id));
  }
}
