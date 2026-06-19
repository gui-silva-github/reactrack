import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PT } from '../../../../core/constants/i18n-pt';
import { OpinlyStateService } from '../../../../core/services/state/opinly-state.service';

@Component({
  selector: 'app-new-opinion',
  imports: [FormsModule],
  templateUrl: './new-opinion.html',
  styleUrl: './new-opinion.css',
})
export class NewOpinion {
  private readonly opinlyState = inject(OpinlyStateService);
  readonly t = PT.opinly;

  userName = '';
  title = '';
  body = '';
  errors = signal<string[]>([]);
  submitting = signal(false);

  submit(): void {
    const errors: string[] = [];
    if (this.title.trim().length < 5) errors.push(this.t.titleMinLength);
    if (this.body.trim().length < 10 || this.body.trim().length > 300) errors.push(this.t.bodyLength);
    if (!this.userName.trim()) errors.push(this.t.nameRequired);

    this.errors.set(errors);
    if (errors.length) return;

    this.submitting.set(true);
    this.opinlyState
      .addOpinion({
        id: '',
        title: this.title.trim(),
        body: this.body.trim(),
        userName: this.userName.trim(),
        votes: 0
      })
      .subscribe({
        next: () => {
          this.userName = '';
          this.title = '';
          this.body = '';
          this.errors.set([]);
          this.submitting.set(false);
        },
        error: () => {
          this.submitting.set(false);
        }
      });
  }
}
