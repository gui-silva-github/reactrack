import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen bg-[url('/bg_img.png')] bg-cover bg-center">
      <div class="flex flex-col items-center mt-20 px-4 text-center text-gray-800">
        <img src="/assets/png/header.png" alt="Cabeçalho" class="w-36 h-36 rounded-full mb-6 object-cover shrink-0" />

        <div class="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
          <span>Olá {{ userName() }}!</span>
          <img src="/assets/png/hand.png" class="w-8 aspect-square" alt="Mão" />
        </div>

        <h2 class="text-3xl sm:text-5xl font-semibold mb-4">Bem Vindo ao ReactRack</h2>
        <p class="mb-8 max-w-md">Vamos começar a usar os sistemas do ReactRack!</p>

        @if (isLoggedIn()) {
          <a routerLink="/systems" class="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all">
            Vamos lá!
          </a>
        } @else {
          <a routerLink="/login" class="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all">
            Vamos lá!
          </a>
        }
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent {
  constructor(private authService: AuthService) {}

  userName(): string {
    const user = this.authService.userData();
    return user?.name || 'Usuário';
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}

