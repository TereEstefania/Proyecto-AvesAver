import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { PhotoService } from '../services/photo.service';
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
  ultimaImagenUrl: string| null = '';

  nombreUltimoAvistamiento: string | null = null;

  avistamientos: Avistamiento[] = [];

  constructor(private navCtrl: NavController, private auth: AuthenticationService,private avistamientosService: AvistamientosService,private photoService: PhotoService, private toastController: ToastController) {}

  async ngOnInit() {
    // Obtener el nombre del usuario autenticado
    this.nombreUsuario = await this.auth.getUsuario();
    try {
      const uid = await this.auth.obtenerUid(); // Obtiene el UID del usuario autenticado
      if (uid) {
        this.avistamientos = await this.avistamientosService.obtenerAvistamientosPorUsuario(uid);
      } else {
        console.error('No se pudo obtener el UID del usuario.');
      }
    } catch (error) {
      console.error('Error al cargar avistamientos:', error);
    }
  }
  
  
/**
 * @function agregar
 * @description esta función permite que el usuario navegue a la pestaña 'agregar'
 */
  agregar() {
    this.navCtrl.navigateForward('/agregar');  
  }

  async cargarAvistamientos(event: any) {
    try {
      const uid = await this.auth.obtenerUid();
      if (uid) {
        this.avistamientos = await this.avistamientosService.obtenerAvistamientosPorUsuario(uid);
      } else {
        console.error('No se pudo obtener el UID del usuario.');
      }
    } catch (error) {
      console.error('Error al cargar avistamientos:', error);
    } finally {
      event.target.complete(); // Completa el refresco
    }
  }
  
  async ionViewWillEnter() {
    try {
      // Obtener el UID del usuario autenticado
      const uid = await this.auth.obtenerUid(); // Asegúrate de que esto sea correcto
  
      if (uid) { // Verifica que uid no sea null
        this.avistamientos = await this.avistamientosService.obtenerAvistamientosPorUsuario(uid);
        console.log('Avistamientos cargados:', this.avistamientos);
      } else {
        console.error('El usuario no está autenticado');
      }
    } catch (error) {
      console.error('Error al cargar avistamientos:', error);
    }
  }
  
  editarAvistamiento(avistamiento:any) {
    console.log('Editando avistamiento:', avistamiento);
  }

 async eliminarAvistamiento(avistamiento:any) {
    console.log('Eliminando avistamiento:', avistamiento);
  }
}
