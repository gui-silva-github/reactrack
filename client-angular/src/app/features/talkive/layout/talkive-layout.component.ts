import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';
import { TALKIVE_REDIRECT_URL } from '../../../core/constants/api-urls';
import { TalkiveStateService } from '../../../core/services/state/talkive-state.service';
import { TalkiveService } from '../../../core/services/talkive/talkive.service';

@Component({
  selector: 'app-talkive-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class TalkiveLayoutComponent implements OnInit {
  private readonly talkiveService = inject(TalkiveService);
  private readonly talkiveState = inject(TalkiveStateService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private dataLoaded = false;
  private isLoading = false;

  ngOnInit(): void {
    this.talkiveService
      .authStateChanges()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async (user) => {
        if (user) {
          if (!this.dataLoaded && !this.isLoading) {
            this.isLoading = true;
            this.dataLoaded = true;
            try {
              await this.talkiveState.loadUserData(user.uid);
            } finally {
              this.isLoading = false;
            }
          }
        } else {
          this.dataLoaded = false;
          this.isLoading = false;
          this.talkiveState.clearSession();
          const isLoginPage =
            this.router.url === TALKIVE_REDIRECT_URL ||
            this.router.url === `${TALKIVE_REDIRECT_URL}/`;
          if (!isLoginPage) {
            this.router.navigate([TALKIVE_REDIRECT_URL]);
          }
        }
      });
  }
}
