import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';


  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private toastController: ToastController

  ) { }

  async login() {
    try {
      await this.authService.logIn(this.email, this.password);
      this.router.navigate(['./tabs/tab1']);
    } catch (error) {
      console.error('Error logging in:', error);
      this.presentToast('Ha ocurrido un error, revise los datos ingresados');
    }
  }

  async loginGoogle() {
    try {
      await this.authService.loginGoogle();
    } catch (error) {
      console.error('Error logging in with Google:', error);
      this.presentToast('Google login failed. Please try again.');
    }
  }


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
