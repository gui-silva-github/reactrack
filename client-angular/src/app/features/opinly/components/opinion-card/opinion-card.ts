import { Component, effect, inject, input, signal } from '@angular/core';
import { I18nService } from '../../../../core/services/i18n/i18n.service';
import { IOpinionData } from '../../../../core/models';
import { OpinlyStateService } from '../../../../core/services/state/opinly-state.service';

@Component({
  selector: 'app-opinion-card',
  imports: [],
  templateUrl: './opinion-card.html',
  styleUrl: './opinion-card.css',
})
export class OpinionCard {
  private readonly opinlyState = inject(OpinlyStateService);
  readonly i18n = inject(I18nService);
  readonly opinion = input.required<IOpinionData>();

  optimisticVotes = signal(0);
  voting = signal(false);

  constructor() {
    effect(() => {
      this.optimisticVotes.set(this.opinion().votes);
    });
  }

  upvote(): void {
    this.voting.set(true);
    this.optimisticVotes.update((v) => v + 1);
    this.opinlyState.upvoteOpinion(this.opinion().id);
    this.voting.set(false);
  }

  downvote(): void {
    if (this.optimisticVotes() <= 0) return;
    this.voting.set(true);
    this.optimisticVotes.update((v) => v - 1);
    this.opinlyState.downvoteOpinion(this.opinion().id);
    this.voting.set(false);
  }
}
