import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class SseService {
  private clients: Map<string, Subject<string>> = new Map();

  addClient(url: string): Subject<string> {
    const client = new Subject<string>();
    this.clients.set(url, client);
    return client;
  }

  removeClient(url: string) {
    this.clients.delete(url);
  }

  sendUpdate(url: string) {
    const client = this.clients.get(url);
    if (client) {
      client.next('update');
    }
  }
}
