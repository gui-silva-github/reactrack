import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CloudinaryService } from '../../../../core/services/cloudinary/cloudinary.service';
import { TalkiveStateService } from '../../../../core/services/state/talkive-state.service';
import { TalkiveService } from '../../../../core/services/talkive/talkive.service';
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
    .profile { min-height: 90vh; background: url('/talkive/background.png') no-repeat center/cover; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; }
    .profile-container { background: white; display: flex; align-items: center; justify-content: space-between; min-width: 700px; border-radius: 10px; border: 1px solid #077eff; }
    .profile-pic { max-width: 160px; aspect-ratio: 1/1; border-radius: 50%; margin: 20px auto; object-fit: cover; }
    form { display: flex; flex-direction: column; gap: 20px; padding: 40px; }
    .row { display: flex; justify-content: space-between; align-items: center; }
    .back { border: none; background: transparent; color: #077eff; font-size: 1.3rem; cursor: pointer; }
    label { display: flex; align-items: center; gap: 10px; color: gray; cursor: pointer; }
    label img { width: 50px; aspect-ratio: 1/1; border-radius: 50%; object-fit: cover; }
    input, textarea { padding: 10px; min-width: 300px; border: 1px solid #c9c9c9; outline-color: #077eff; border-radius: 6px; }
    form > button { border: none; color: white; background: #077eff; padding: 8px; font-size: 16px; cursor: pointer; border-radius: 6px; }
    @media (max-width: 820px) { .profile-container { min-width: auto; width: 100%; flex-direction: column-reverse; } }
  `]
})
export class ProfileComponent {
  private readonly talkiveState = inject(TalkiveStateService);
  private readonly talkiveService = inject(TalkiveService);
  private readonly cloudinaryService = inject(CloudinaryService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  name = '';
  bio = '';
  avatarPreview = '';
  private avatarUrl = '';
  private selectedFile: File | null = null;

  constructor() {
    const user = this.talkiveState.userData();
    if (user) {
      this.name = user.name;
      this.bio = user.bio;
      this.avatarPreview = user.avatar;
      this.avatarUrl = user.avatar;
    }
  }

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    this.selectedFile = file;
    this.avatarPreview = URL.createObjectURL(file);
  }

  async save(): Promise<void> {
    const user = this.talkiveState.userData();
    if (!user) return;

    try {
      if (this.selectedFile) {
        this.avatarUrl = await new Promise<string>((resolve, reject) => {
          this.cloudinaryService.upload(this.selectedFile!).subscribe({
            next: (url) => resolve(url),
            error: (err) => reject(err),
          });
        });
      }

      await this.talkiveService.updateUserProfile(user.id, {
        name: this.name,
        bio: this.bio,
        avatar: this.avatarUrl,
      });

      this.toastService.success('Perfil atualizado.');
      this.router.navigate(['/systems/talkive/chat']);
    } catch {
      this.toastService.error('Erro ao salvar perfil.');
    }
  }

  goBack(): void {
    this.router.navigate(['/systems/talkive/chat']);
  }
}
