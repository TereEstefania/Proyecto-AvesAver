import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import {sendPasswordResetEmail } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private aveAuth: AngularFireAuth) { }

  /**
   * @function signUp
   * @param email tipo string corresponde al correo electrónico que el usuario utiliza para registrarse.
   * @param password tipo string corresponde a la contraseña que el usuario utiliza para registrarse.
   * @returns Si el registro es exitoso, se crea un objeto de usuario que representa al nuevo usuario registrado. Si ocurre algún error durante el proceso de registro no se crea el usuario.
   * @description esta función permite crear un usuario proporcionando email y contraseña.
   */
  signUp(email: string, password: string) {
    return this.aveAuth.createUserWithEmailAndPassword(email, password);
  }

  /**
   * @function logIn
   * @param email tipo string corresponde al correo electrónico que el usuario utilizó para registrarse.
   * @param password tipo string corresponde a la contraseña que el usuario utilizó para registrarse.
   * @returns si la contraseña y mail son correctas se inicia sesión exitosamente.
   * @description esta función permite que un usuario previamente registrado pueda iniciar sesión.
   */
  logIn(email: string, password: string) {
    return this.aveAuth.signInWithEmailAndPassword(email, password);
  }

  /**
   * @function logOut
   * @returns Si el cierre de sesión es exitoso, la promesa se resuelve sin devolver ningún valor específico, indicando que el usuario ha cerrado sesión correctamente.
   * @description esta función permite que el usuario cierre su sesión.
   */
  logOut() {
    return this.aveAuth.signOut();
  }

  /**
   * @function loginGoogle
   * @returns Si el usuario se autentica correctamente a través de Google se puede acceder a la aplicación. 
   * @description esta función se utiliza para autenticar a un usuario mediante su cuenta de Google utilizando Firebase Authentication, usando el método 'signInWithPopup' se abrirá una ventana emergente que solicita al usuario que inicie sesión en su cuenta de Google y otorgue permisos a la aplicación. 
   */
  loginGoogle() {
    return this.aveAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  /**
   * @function resetPassword
   * @param email de tipo string, es el mail por medio del cual el usuario recupera su contraseña
   * @returns Una promesa que se resuelve si el correo de restablecimiento de contraseña se envía con éxito. Si ocurre un error, la promesa se rechaza y devuelve un mensaje de error. 
   * @description Envía un correo electrónico para restablecer la contraseña del usuario.
   */
  resetPassword(email: string) {
    return this.aveAuth.sendPasswordResetEmail(email);
  }


}
