import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PT } from '../../../../core/constants/i18n-pt';
import { ProjectsStateService } from '../../../../core/services/state/projects-state.service';
import { ProjectsSpinner } from '../projects-spinner/projects-spinner';

@Component({
  selector: 'app-projects-search',
  imports: [FormsModule, ProjectsSpinner],
  templateUrl: './projects-search.html',
  styleUrl: './projects-search.css',
})
export class ProjectsSearch {
  readonly projectsState = inject(ProjectsStateService);
  readonly t = PT.projects;

  search(): void {
    this.projectsState.searchUser();
  }
}
