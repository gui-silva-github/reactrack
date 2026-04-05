import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile">
      <div class="profile-container">
        <form (ngSubmit)="save()">
          <div class="row">
            <h3>Detalhes do perfil</h3>
            <button type="button" class="back" (click)="goBack()">←</button>
          </div>

          <label for="avatar">
            <input id="avatar" type="file" (change)="onFileChange($event)" accept=".png,.jpg,.jpeg" hidden />
            <img [src]="avatarPreview || '/assets/talkive/avatar_icon.png'" alt="Avatar" />
            Upload da imagem
          </label>

          <input [(ngModel)]="name" name="name" type="text" placeholder="Seu nome" required />
          <textarea [(ngModel)]="bio" name="bio" placeholder="Escreva sua bio" required maxlength="300"></textarea>
          <button type="submit">Salvar</button>
        </form>

        <img class="profile-pic" [src]="avatarPreview || '/assets/talkive/logo_icon.png'" alt="Perfil" />
      </div>
    </div>
  `,
  styles: [`
    .profile {
      min-height: 90vh;
      background: url('/talkive/background.png') no-repeat center/cover;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
    }
    .profile-container {
      background: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-width: 700px;
      border-radius: 10px;
      border: 1px solid #077eff;
    }
    .profile-pic {
      max-width: 160px;
      aspect-ratio: 1/1;
      border-radius: 50%;
      margin: 20px auto;
      object-fit: cover;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 40px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .back {
      border: none;
      background: transparent;
      color: #077eff;
      font-size: 1.3rem;
      cursor: pointer;
    }
    label {
      display: flex;
      align-items: center;
      gap: 10px;
      color: gray;
      cursor: pointer;
    }
    label img {
      width: 50px;
      aspect-ratio: 1/1;
      border-radius: 50%;
      object-fit: cover;
    }
    input, textarea {
      padding: 10px;
      min-width: 300px;
      border: 1px solid #c9c9c9;
      outline-color: #077eff;
      border-radius: 6px;
    }
    form > button {
      border: none;
      color: white;
      background: #077eff;
      padding: 8px;
      font-size: 16px;
      cursor: pointer;
      border-radius: 6px;
    }
    @media (max-width: 820px) {
      .profile-container {
        min-width: auto;
        width: 100%;
        flex-direction: column-reverse;
      }
    }
  `]
})
export class ProfileComponent {
  name = '';
  bio = '';
  avatarPreview = '';

  constructor(
    private router: Router,
    private toastService: ToastService
  ) {
    const raw = localStorage.getItem('talkive-profile');
    if (!raw) return;
    const profile = JSON.parse(raw) as { name?: string; bio?: string; avatar?: string };
    this.name = profile.name || '';
    this.bio = profile.bio || '';
    this.avatarPreview = profile.avatar || '';
  }

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    this.avatarPreview = URL.createObjectURL(file);
  }

  save(): void {
    const raw = localStorage.getItem('talkive-profile');
    const previous = raw ? JSON.parse(raw) as Record<string, string> : {};
    localStorage.setItem('talkive-profile', JSON.stringify({
      ...previous,
      name: this.name,
      bio: this.bio,
      avatar: this.avatarPreview
    }));
    this.toastService.success('Perfil atualizado.');
  }

  goBack(): void {
    this.router.navigate(['/systems/talkive/chat']);
  }
}










