import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  email: string = '';

  constructor(
    public auth: AuthenticationService,
    public router: Router,
    private toastController: ToastController
  ) { }

  /**
   * @function recuperarContra
   * @description
   */
  async recuperarContra() {
    try {
      const auth = getAuth(); //
      await sendPasswordResetEmail(auth, this.email);
      await this.presentToast('Contraseña recuperada: Link de recuperación enviado a su correo electrónico');
      setTimeout(() => {
        this.router.navigate(['login']); // 
      }, 2000);
    } catch (error: any) {
      if ( error.code === 'auth/user-not-found') {
        console.log('Correo electrónico no registrado:', error);
        await this.presentToast('Error: Correo electrónico no registrado');
      } else {
        // Otros errores generales
        console.log('Error al enviar el correo electrónico de restablecimiento:', error);
        await this.presentToast('Error: No se pudo enviar el correo electrónico de restablecimiento');
      }
    }
  }

    /**
   * @function presentToast
   * @param mensage  tipo string, recibe el mensaje a mostrar en pantalla
   * @description crea y muestra en pantalla una advertencia
   */
    async presentToast(message: string) {
      const toast = await this.toastController.create({
        message,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }

  ngOnInit() {
  }

}
