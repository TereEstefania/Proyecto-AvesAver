import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { validarEmail } from '../utils/validations';

import { ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  isLoading = true; // Estado de carga
  isLoggedIn: boolean = false; // Estado de autenticación

  email: string = '';
  password: string = '';


  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private toastController: ToastController

  ) { }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      this.isLoading = false; // Cambiar el estado de carga después de verificar

      if (isLoggedIn) {
        console.log("LOGUEADOOOOO");
        this.router.navigate(['/tabs']);
      } else {
        console.log("Sin LOGUEARRRR");
      }
    });
  }

  /**
   * @function login
   * @description esta función utiliza el servicio de autenticación 'authService' para autenticar al usuario con su correo y contraseña, dependiendiendo del resultado de la autenticación es redirigidio a otra página o muestra un mensaje de error. Tambien valida el formato del mail.
   */
  async login() {
    // Validar email y contraseña utilizando las funciones importadas
    if (!validarEmail(this.email)) {
      this.presentToast('Por favor, ingrese un email válido');
      return;
    }

    try {
      await this.authService.logIn(this.email, this.password);
      this.router.navigate(['./tabs/tab1']);
    } catch (error) {
      console.error('Error logging in:', error);
      this.presentToast('Error al iniciar sesión, revise los datos ingresados');
    }
  }



  /**
   * @function loginGoogle
   * @description esta función utiliza el servicio de autenticación 'authService' para autenticar al usuario a través de una cuenta de Google, 
   * dependiendiendo del resultado de la autenticación es redirigidio a otra página o muestra un mensaje de error.
   */
  async loginGoogle() {
    try {
      await this.authService.loginGoogle();
      this.router.navigate(['/tabs/tab1']);
    } catch (error) {
      console.error('Error logging in with Google:', error);
      this.presentToast('Ha ocurrido un error, intente nuevamente');
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

}
