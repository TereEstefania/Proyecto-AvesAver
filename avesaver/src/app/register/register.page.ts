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

async registrarse() {
  try {
    await this.authService.signUp(this.email, this.password);
    this.router.navigate(['/tabs/tab1']);
    this.presentToast('Registro exitoso');
  } catch (error: any) {
    console.error('Error al registrar:', error);
    this.presentToast('Error al registrar: ' + error.message);
  }
}

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
