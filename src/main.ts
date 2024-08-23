import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { ChatClient, RoomOptionsDefaults, Reaction } from '@ably/chat';
import { Realtime } from 'ably';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <h1>{{ name }}!</h1>
    <p>Click these emojis to send a room-level reaction.</p>
    <button type="button" id="smiley"><span> 😀 </span></button>
    <button type="button" id="fire"><span> 🔥 </span></button>
    <button type="button" id="heart"><span> ❤️ </span></button>
    <button type="button" id="thumbsup"><span> 👍 </span></button>
    <pre id="messages"></pre>
  `,
})
export class App {
  name = 'Room-level reactions using Ably Chat inside Angular';

  constructor() {
    this.initializeAbly();
  }

  async initializeAbly(): Promise<void> {
    const clientId: string = Date.now().toString().slice(-5);
    const ably = new Realtime({ key: 'Squ8ag.ex4hJg:Et2nm7jw0emMoDvrYbfeicLIZn9tYGUakJvIJ9slFoc', clientId: 'client-'+clientId });
    const chat = new ChatClient(ably);

    const room = chat.rooms.get('basketball-stream', {
      reactions: RoomOptionsDefaults.reactions,
    });

    await room.attach();

    const msgDisplay: HTMLElement | null = document.getElementById('messages');
    if (msgDisplay) {
      const { unsubscribe } = room.reactions.subscribe((reaction: Reaction) => {
        const msgData: string = JSON.stringify(reaction.clientId+' sends '+reaction.type, null, 2);
        msgDisplay.textContent += `${msgData}\n`;
      });

      ['smiley', 'fire', 'heart', 'thumbsup'].forEach((id: string) => {
        const button = document.getElementById(id);
        if (button) {
          button.addEventListener('click', async () => {
            await room.reactions.send({ type: id });
          });
        }
      });
    }
  }
}

bootstrapApplication(App);
