import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { ToastController } from '@ionic/angular';
import { AvistamientosService } from '../services/avistamientos.service';
import { Avistamiento } from '../models/avistamiento.model';



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

          // Ordenar los avistamientos por fecha en orden descendente
          const avistamientosOrdenados = this.avistamientos.sort((a: any, b: any) => {
            return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
          });
        
          // Obtener los últimos 5 avistamientos
          this.avistamientos = avistamientosOrdenados.slice(0, 7);

      } else {
        console.error('No se pudo obtener el UID del usuario.');
      }
    } catch (error) {
      console.error('Error al cargar avistamientos:', error);
      this.presentToast('Error al cargar avistamientos.'); 
    } finally {
      if (event && event.target) {
        event.target.complete(); 
      }
    }
  }

  /**
  * @function ionViewWillEnter
  * @description esta funcion recarga los avistamientos cuando la lista se vuelve visible
  */
  async ionViewWillEnter() {
    await this.cargarAvistamientos(); 
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
