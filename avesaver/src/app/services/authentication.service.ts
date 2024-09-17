import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private aveAuth: AngularFireAuth) { }

  signUp(email: string, password: string) {
    return this.aveAuth.createUserWithEmailAndPassword(email, password);
  }

  logIn(email: string, password: string) {
    return this.aveAuth.signInWithEmailAndPassword(email, password);
  }

  logOut() {
    return this.aveAuth.signOut();
  }

  getCurrentUser() {
    return this.aveAuth.currentUser;
  }

  loginGoogle() {
    return this.aveAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

}
