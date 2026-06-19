import { Component, inject } from '@angular/core';
import { ProjectsSearch } from "../../components/projects-search/projects-search";
import { ProjectsUser } from '../../components/projects-user/projects-user';
import { ProjectsError } from '../../components/projects-error/projects-error';
import { ProjectsStateService } from '../../../../core/services/state/projects-state.service';

@Component({
  selector: 'app-home',
  imports: [ProjectsSearch, ProjectsUser, ProjectsError],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly projectsState = inject(ProjectsStateService);
}
