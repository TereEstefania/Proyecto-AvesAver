import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { validarEmail } from '../utils/validations';
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
   * @description esta función permite que el usuario recupere su contraseña recibiendo un link de recuperación a su email. Si el link es enviado muestra un mensaje indicandolo. Si ocurre algún error muestra un mensaje indicándolo.
   */
  async recuperarContra() {
    if (!validarEmail(this.email)) {
      this.presentToast('Por favor, ingrese un email válido');
      return;
    }
    
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
