import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { sendPasswordResetEmail } from 'firebase/auth';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Platform } from '@ionic/angular';
import { Subject, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  user: any;
  credential: any;
  public logoutEvent = new Subject<void>();

  constructor(private aveAuth: AngularFireAuth, private platform: Platform) {
    this.platform.ready().then(() => {
      GoogleAuth.initialize();
    });

    this.aveAuth.authState.subscribe(user => {
      this.user = user;
    });
  }
  
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
    return this.aveAuth.signOut().then(() => {
      this.logoutEvent.next();  // Emitir el evento de logout
    });
  }

  /**
   * @function loginGoogle
   * @returns Si el usuario se autentica correctamente a través de Google se puede acceder a la aplicación. 
   * @description esta función se utiliza para autenticar a un usuario mediante su cuenta de Google utilizando Firebase Authentication, usando el método 'signInWithPopup' se abrirá una ventana emergente que solicita al usuario que inicie sesión en su cuenta de Google y otorgue permisos a la aplicación. 
   */
  async loginGoogle() {
    try {
      const usuarioGoogle = await GoogleAuth.signIn(); // Obtiene el usuario de Google
      this.credential = firebase.auth.GoogleAuthProvider.credential(usuarioGoogle.authentication.idToken); // Obtiene el token de ID
  
      // Inicia sesión en Firebase con el token
      this.user = await this.aveAuth.signInWithCredential(this.credential);
      
      console.log('Usuario autenticado en Firebase:', this.user);
      return this.user; // Devuelve el usuario autenticado
    } catch (error) {
      console.error('Error durante el inicio de sesión con Google:', error);
      throw error; 
    }
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

/**
 * @function obtenerUid
 * @returns retorna el UID del usuario autenticado o null si no está autenticado.
 * @description esta función permite acceder a la información del usuario autenticado en Firebase.
 */
obtenerUid(): Promise<string | null> {
  return this.aveAuth.authState.pipe(
    take(1) // Toma solo el primer valor emitido (estado actual de autenticación)
  ).toPromise().then(user => user ? user.uid : null);
}

/**
 * @function getUsuario
 * @returns retorna el nombre del usuario autenticado. Si el usuario no tiene un nombre asignado (displayName), toma la primera parte de su dirección de correo electrónico (antes del @). Si no hay un usuario autenticado, el método devuelve null
 * @description esta función permite que se obtenga el usuario autenticado en Firebase.
 */
getUsuario(): Promise<string | null> {
  return this.aveAuth.authState.pipe(
    take(1) 
  ).toPromise().then(user => {
    if (user) {
      if (user.displayName) {
        return user.displayName;
      }
      if (user.email) {
        return user.email.split('@')[0];
      }
    }
    return null; // Si no hay usuario autenticado o no tiene displayName ni email
  });
}

}
