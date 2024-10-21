import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { PhotoService } from '../services/photo.service';
import { ToastController } from '@ionic/angular';
import { AvistamientosService } from '../services/avistamientos.service';
import { Avistamiento } from '../models/avistamiento.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  nombreUsuario: string | null = '';
  avistamientos: Avistamiento[] = [];

  constructor(
    private navCtrl: NavController, 
    private auth: AuthenticationService,
    private avistamientosService: AvistamientosService,
    private toastController: ToastController,
    
  ) {}

  async ngOnInit() {
    this.nombreUsuario = await this.auth.getUsuario();
    await this.cargarAvistamientos();
  }
/**
   * @function cargarAvistamientos
   * @description Carga avistamientos del usuario autenticado
   */
async cargarAvistamientos(event?: any) {
  try {
    const uid = await this.auth.obtenerUid();
    if (uid) {
      
      this.avistamientos = await this.avistamientosService.obtenerAvistamientosCompartidos();
    } else {
      console.error('No se pudo obtener el UID del usuario.');
    }
  } catch (error) {
    console.error('Error al cargar avistamientos:', error);
    this.presentToast('Error al cargar avistamientos.'); // Notifica al usuario
  } finally {
    if (event && event.target) {
      event.target.complete(); // Completa el refresco solo si existe event.target
    }
  }
}

async ionViewWillEnter() {
  await this.cargarAvistamientos(); // Recarga avistamientos cuando la vista se vuelve visible
}
  /**
   * @function agregar
   * @description Navega a la página de agregar avistamientos
   */
  agregar() {
    this.navCtrl.navigateForward('/agregar');  
  }

  /**
   * @function presentToast
   * @description Muestra un mensaje emergente al usuario
   */
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    await toast.present();
  }
}
