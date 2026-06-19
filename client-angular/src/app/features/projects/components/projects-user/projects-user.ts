import { Component, input } from '@angular/core';
import { PT } from '../../../../core/constants/i18n-pt';
import { IUserProps } from '../../../../core/models';
import { GITHUB_PROFILE_URL } from '../../../../core/constants/api-urls';

@Component({
  selector: 'app-projects-user',
  imports: [],
  templateUrl: './projects-user.html',
  styleUrl: './projects-user.css',
})
export class ProjectsUser {
  readonly user = input.required<IUserProps>();
  readonly t = PT.projects;
  readonly githubUrl = GITHUB_PROFILE_URL;
}
