import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

interface NavLink {
  name: string;
  path: string;
}

@Component({
  selector: 'app-navbar-systems',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar-systems.html',
  styleUrl: './navbar-systems.css',
})
export class NavbarSystemsComponent {
  navLinks = computed<NavLink[]>(() => {
    const links: NavLink[] = [
      { name: 'Talkive', path: '/systems/talkive' },
      { name: 'Opiniões', path: '/systems/opinly' },
      { name: 'Eventos', path: '/systems/convene' },
      { name: 'Filmes', path: '/systems/movies' },
      { name: 'Investimentos', path: '/systems/investments' },
      { name: 'Projetos', path: '/systems/projects' },
      { name: 'Academia', path: '/systems/fit' },
      { name: 'Criptomoedas', path: '/systems/crypto' }
    ];
    return links;
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
}
