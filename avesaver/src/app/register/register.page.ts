import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  email: string = '';
  password: string = '';


  constructor(    
    private authService: AuthenticationService,
    private router: Router,
    private toastController: ToastController
) { }


/**
 * @function registrarse 
 * @description esta función permite que el usuario pueda registrarse en la aplicación por medio de un mail y contraseña. Valida el formato del mail y la contraseña. Si el registro es exitoso, navega a otra página de la aplicación y muestra un mensaje de éxito. Si ocurre algún error durante el proceso, se maneja el error mostrando un mensaje al usuario que indica lo que salió mal.
 */
async registrarse() {
  // Expresión regular para validar el formato del email
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

   // Expresión regular para validar el formato de la contraseña
   const passwordPattern = /^(?=.*?[A-Z])(?=.*?\d)(?=.*?[@$!%*?&-_])[A-Za-z\d@$!%*?&-_]{8,}$/;

  // Validación del email
  if (!this.email.match(emailPattern)) {
    // Si el email no tiene un formato válido, muestra el mensaje y detiene el login
    this.presentToast('Por favor, ingrese un email válido');
    return;
  }

  if (!this.password.match(passwordPattern)) {
    this.presentToast('La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, un número y un símbolo especial');
    return;
  }

  try {
    await this.authService.signUp(this.email, this.password);
    this.router.navigate(['/tabs/tab1']);
    this.presentToast('Registro exitoso');
  } catch (error: any) {
    console.error('Error al registrar:', error);
    this.presentToast('Error al registrar: ' + error.message);
  }
}

/**
 * @function presentToast
 * @param mensage  tipo string, recibe el mensaje a mostrar en pantalla
 * @description crea y muestra en pantalla una advertencia 
 */
async presentToast(message: string) {
  const toast = await this.toastController.create({
    message: message,
    duration: 3000,
    position: 'top'
  });
  toast.present();
}


  ngOnInit() {
  }

}
