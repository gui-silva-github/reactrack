import { Component } from '@angular/core';
import { PT } from '../../../../core/constants/i18n-pt';

@Component({
  selector: 'app-projects-error',
  imports: [],
  templateUrl: './projects-error.html',
  styleUrl: './projects-error.css',
})
export class ProjectsError {
  readonly t = PT.projects;
}
