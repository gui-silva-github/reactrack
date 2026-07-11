import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../../../core/services/i18n/i18n.service';
import { OpinlyStateService } from '../../../../core/services/state/opinly-state.service';

@Component({
  selector: 'app-new-opinion',
  imports: [FormsModule],
  templateUrl: './new-opinion.html',
  styleUrl: './new-opinion.css',
})
export class NewOpinion {
  private readonly opinlyState = inject(OpinlyStateService);
  readonly i18n = inject(I18nService);

  userName = '';
  title = '';
  body = '';
  errors = signal<string[]>([]);
  submitting = signal(false);

  submit(): void {
    const errors: string[] = [];
    if (this.title.trim().length < 5) errors.push(this.i18n.t('opinly.titleMinLength'));
    if (this.body.trim().length < 10 || this.body.trim().length > 300) errors.push(this.i18n.t('opinly.bodyLength'));
    if (!this.userName.trim()) errors.push(this.i18n.t('opinly.nameRequired'));

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
