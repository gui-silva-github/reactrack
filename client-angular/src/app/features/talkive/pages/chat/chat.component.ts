import { Component } from '@angular/core';
import { TalkiveLeftSidebarComponent } from '../../components/left-sidebar/left-sidebar.component';
import { TalkiveChatBoxComponent } from '../../components/chat-box/chat-box.component';
import { TalkiveRightSidebarComponent } from '../../components/right-sidebar/right-sidebar.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [TalkiveLeftSidebarComponent, TalkiveChatBoxComponent, TalkiveRightSidebarComponent],
  template: `
    <div class="chat">
      <div class="chat-container">
        <app-talkive-left-sidebar />
        <app-talkive-chat-box />
        <app-talkive-right-sidebar />
      </div>
    </div>
  `,
})
export class ChatComponent {}
