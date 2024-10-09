import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  nombreUsuario: string | null = '';
  constructor(private navCtrl: NavController, private auth: AuthenticationService) {}

  async ngOnInit() {
    // Obtener el nombre del usuario autenticado
    this.nombreUsuario = await this.auth.getUsuario();
  }
  
  agregar() {
    this.navCtrl.navigateForward('/agregar');  
  }
}
