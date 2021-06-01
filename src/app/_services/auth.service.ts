import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { firebase } from '@firebase/app';
import '@firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authState;
  isLoggedIn = false;

  constructor(private auth: AngularFireAuth) { }

  load(): void {
    this.auth.authState.subscribe(auth => {
      this.authState = auth;
      if (auth) {
        this.isLoggedIn = true;
      }
    });
  }

  logout(): void {
    this.auth.signOut();
    this.isLoggedIn = false;
  }

  googleLogin(): Promise<void> {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider: any): Promise<void> {
    return this.auth.signInWithPopup(provider)
      .then(cred => {
        this.authState = cred;
        this.isLoggedIn = true;
      });
  }

  loggedIn(): boolean {
    return this.isLoggedIn;
  }
}
