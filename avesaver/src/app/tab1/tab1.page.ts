import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthenticationService } from '../services/authentication.service';
import { EbirdService } from '../services/ebird.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  nombreUsuario: string | null = '';
  avistamientos: any[] = [];
  constructor(
    private navCtrl: NavController, 
    private auth: AuthenticationService,
    private ebirdService: EbirdService) {}

  async ngOnInit() {
    // Obtener el nombre del usuario autenticado
    this.nombreUsuario = await this.auth.getUsuario();
    this.obtenerAvistamientosRecientes();
  }
  
  agregar() {
    this.navCtrl.navigateForward('/agregar');  
  }
 

  obtenerAvistamientosRecientes() {
    const regionCode = 'US';  // Puedes cambiarlo por cualquier código de región válido
    this.ebirdService.getRecentObservations(regionCode).subscribe(
      (data) => {
        this.avistamientos = data;
        console.log(this.avistamientos);
      },
      (error) => {
        console.error('Error obteniendo los avistamientos:', error);
      }
    );
  }
}

