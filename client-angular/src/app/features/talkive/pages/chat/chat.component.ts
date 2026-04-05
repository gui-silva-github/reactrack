import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat">
      <div class="chat-container">
        <aside class="left">
          <h3>Conversas</h3>
          <div class="contact">Guilherme (você)</div>
          <div class="contact active">Equipe Reactrack</div>
          <div class="contact">Suporte</div>
        </aside>

        <section class="middle">
          <header class="chat-header">Equipe Reactrack</header>
          <div class="messages">
            @for (msg of messages; track msg.id) {
              <div class="message" [class.mine]="msg.mine">
                {{ msg.text }}
              </div>
            }
          </div>
          <form class="composer" (ngSubmit)="send()">
            <input type="text" name="draft" [(ngModel)]="draft" placeholder="Digite sua mensagem..." required />
            <button type="submit">Enviar</button>
          </form>
        </section>

        <aside class="right">
          <h3>Perfil rápido</h3>
          <p>{{ profileName }}</p>
          <small>{{ profileEmail }}</small>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .chat {
      margin-top: -2.5rem;
      min-height: 96.5vh;
      background: linear-gradient(#596aff, #383699);
      display: grid;
      place-items: center;
    }
    .chat-container {
      width: 95%;
      height: 75vh;
      max-width: 1000px;
      background-color: aliceblue;
      display: grid;
      grid-template-columns: 1fr 2fr 1fr;
      border-radius: 12px;
      overflow: hidden;
    }
    .left, .right {
      padding: 1rem;
      background: #f8fafc;
      border-right: 1px solid #e5e7eb;
    }
    .right {
      border-right: none;
      border-left: 1px solid #e5e7eb;
    }
    .contact {
      padding: 0.45rem;
      border-radius: 6px;
      margin-bottom: 0.35rem;
    }
    .contact.active {
      background: #dbeafe;
      font-weight: 700;
    }
    .middle {
      display: grid;
      grid-template-rows: auto 1fr auto;
      min-height: 0;
    }
    .chat-header {
      padding: 0.8rem;
      border-bottom: 1px solid #e5e7eb;
      font-weight: 700;
    }
    .messages {
      padding: 0.8rem;
      overflow-y: auto;
      display: grid;
      gap: 0.4rem;
      align-content: start;
    }
    .message {
      background: #e5e7eb;
      border-radius: 10px;
      padding: 0.5rem 0.7rem;
      max-width: 80%;
    }
    .message.mine {
      justify-self: end;
      background: #bfdbfe;
    }
    .composer {
      padding: 0.8rem;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 0.5rem;
    }
    .composer input {
      flex: 1;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      padding: 0.55rem;
    }
    .composer button {
      border: none;
      border-radius: 8px;
      background: #2563eb;
      color: white;
      padding: 0.55rem 0.8rem;
      cursor: pointer;
    }
  `]
})
export class ChatComponent {
  draft = '';
  profileName = 'Usuário';
  profileEmail = 'email@talkive.com';

  messages = [
    { id: 1, text: 'Bem-vindo ao Talkive Angular!', mine: false },
    { id: 2, text: 'Legal! Estou testando o chat.', mine: true }
  ];

  constructor() {
    const raw = localStorage.getItem('talkive-profile');
    if (!raw) return;
    const profile = JSON.parse(raw) as { name?: string; email?: string };
    this.profileName = profile.name || this.profileName;
    this.profileEmail = profile.email || this.profileEmail;
  }

  send(): void {
    const text = this.draft.trim();
    if (!text) return;
    this.messages = [...this.messages, { id: Date.now(), text, mine: true }];
    this.draft = '';
  }
}










