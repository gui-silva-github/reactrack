import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PT } from '../../../../core/constants/i18n-pt';

@Component({
  selector: 'app-projects-layout',
  imports: [RouterOutlet],
  templateUrl: './projects-layout.html',
  styleUrl: './projects-layout.css',
})
export class ProjectsLayout {
  readonly t = PT.projects;
}
