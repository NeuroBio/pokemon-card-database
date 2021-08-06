import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceMock {

  isLoggedIn = false;

  constructor() { }


  logout(): void {
    this.isLoggedIn = false;
  }

  googleLogin(): Promise<void> {
      return new Promise(resolve => resolve());
  }

  loggedIn(): boolean {
    return this.isLoggedIn;
  }
}
