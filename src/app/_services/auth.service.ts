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

  load() {
    this.auth.authState.subscribe(auth => {
      this.authState = auth
      if (auth) {
        this.isLoggedIn = true;
      }
    });
  }

  logout() {
    this.auth.signOut();
    this.isLoggedIn = false;
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider: any) {
    return this.auth.signInWithPopup(provider)
      .then(cred => {
        this.authState = cred;
        this.isLoggedIn = true});
  }

  loggedIn() {
    return this.isLoggedIn;
  }
}
