import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, finalize, tap } from 'rxjs';
import { IOpinionData } from '../../models';
import { OpinlyService } from '../opinly/opinly.service';

@Injectable({ providedIn: 'root' })
export class OpinlyStateService {
  private readonly opinlyService = inject(OpinlyService);

  private readonly opinionsSignal = signal<IOpinionData[]>([]);
  private readonly loadingSignal = signal(false);

  readonly opinions = this.opinionsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly totalVotes = computed(() =>
    this.opinionsSignal().reduce((sum, opinion) => sum + opinion.votes, 0)
  );

  constructor() {
    this.loadOpinions();
  }

  loadOpinions(): void {
    this.loadingSignal.set(true);
    this.opinlyService
      .loadOpinions()
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (data) => this.opinionsSignal.set(data),
        error: () => this.opinionsSignal.set([]),
      });
  }

  addOpinion(opinion: Omit<IOpinionData, 'id'> & { id?: string }): Observable<IOpinionData> {
    return this.opinlyService.saveOpinion(opinion).pipe(
      tap((saved) => {
        this.opinionsSignal.update((prev) => [saved, ...prev]);
      })
    )
  }

  upvoteOpinion(id: string): void {
    this.opinlyService.upvoteOpinion(id).subscribe({
      next: () => {
        this.opinionsSignal.update((prev) =>
          prev.map((opinion) =>
            opinion.id === id ? { ...opinion, votes: opinion.votes + 1 } : opinion
          )
        );
      }
    });
  }

  downvoteOpinion(id: string): void {
    const opinion = this.opinionsSignal().find((item) => item.id === id);
    if (!opinion || opinion.votes <= 0) return;

    this.opinionsSignal.update((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, votes: item.votes - 1 } : item
      )
    );

    this.opinlyService.downvoteOpinion(id).subscribe();
  }
}

