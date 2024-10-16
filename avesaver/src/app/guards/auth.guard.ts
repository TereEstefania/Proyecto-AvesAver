import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Asegúrate de estar usando AngularFireAuth
import { firstValueFrom, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private alertController: AlertController
  ) { }

  /**
   * 
   * @function canActivate
   * @description esta funcion evalua si el usuario esta logeado, y de acuerdo a ello le permite navegar hacia una pagina en especifico o redirecciona al login.
   */
  async canActivate(): Promise<boolean> {
    const user = await firstValueFrom(this.afAuth.authState.pipe(take(1)));

    if (user) {
      return true;
    } else {
      await this.presentAlert();
      this.router.navigate(['/login']);
      return false;
    }
  }

  /**
   * 
   * @function presentAlert
   * @description si el usuario fue rediregido hacia el login, le muestra una alerta que lo invita a logearse.
   */
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Autenticación requerida',
      message: 'Necesitas iniciar sesión para acceder a esta función.',
      buttons: ['OK']
    });

    await alert.present();
  }

}
