import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessengerServiceMock {

  constructor() { }

  send(message: string): void { }
}
