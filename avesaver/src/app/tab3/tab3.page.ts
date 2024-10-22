import { Component, OnInit } from '@angular/core';
import { AvistamientosService } from '../services/avistamientos.service';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Avistamiento } from '../models/avistamiento.model';
import { AuthenticationService } from '../services/authentication.service';
import { Share } from '@capacitor/share';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { firstValueFrom } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  avistamientos: Avistamiento[] = [];
  private unsubscribe$ = new Subject<void>(); // Subject para manejar la cancelación de suscripciones

  constructor( 
    private navCtrl: NavController, 
    private auth: AuthenticationService,
    private avistamientosService: AvistamientosService,
    private toastController: ToastController,
    private aveStorage: AngularFireStorage,
    private alertController: AlertController) {}

  ngOnInit() {
    this.cargarAvistamientos(); // Carga avistamientos al inicializar
    this.escucharRecargas(); // Escuchar eventos de recarga
  }

  /**
   * @function cargarAvistamientos
   * @description Carga avistamientos del usuario autenticado
   */
  async cargarAvistamientos(event?: any) {
    try {
      const uid = await this.auth.obtenerUid();
      if (uid) {
        this.avistamientos = await this.avistamientosService.obtenerAvistamientosPorUsuario(uid);
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

  /**
   * @function escucharRecargas
   * @description Escucha los eventos de recarga de avistamientos
   */
  private escucharRecargas() {
    this.avistamientosService.recargarAvistamientos$
      .pipe(takeUntil(this.unsubscribe$)) // Evitar fugas de memoria
      .subscribe(() => {
        this.cargarAvistamientos(); // Recargar avistamientos cuando se emite el evento
      });
  }

  /**
   * @function ionViewWillEnter
   * @description Se ejecuta cada vez que se entra a la pestaña
   */
  ionViewWillEnter() {
    this.cargarAvistamientos(); // Cargar avistamientos al entrar a la pestaña
  }

  /**
   * @function editarAvistamiento
   * @description Navega a la página de edición para el avistamiento seleccionado
   */
  editarAvistamiento(avistamiento: Avistamiento) {
    this.navCtrl.navigateForward(`/agregar/${avistamiento.id}`);
  }

  /**
   * @function eliminarAvistamiento
   * @description Elimina un avistamiento
   */
  async eliminarAvistamiento(avistamiento: Avistamiento) {
    try {
      if (avistamiento.id) {
        await this.avistamientosService.eliminarAvistamiento(avistamiento.id);
        await this.cargarAvistamientos(); // Recarga la lista tras eliminar
        console.log('Avistamiento eliminado:', avistamiento);
        this.presentToast('Eliminación exitosa.');
      } else {
        console.error('ID de avistamiento no proporcionado');
      }
    } catch (error) {
      console.error('Error al eliminar el avistamiento:', error);
      this.presentToast('Error al eliminar el avistamiento.');
    }
  }

  /**
   * @function marcarComoCompartido
   * @description Crea una copia del avistamiento que se marcó como compartido
   * @param avistamiento 
   */
  async marcarComoCompartido(avistamiento: Avistamiento) {
    try {
      const uid = await this.auth.obtenerUid();
      if (!uid) {
        throw new Error('Usuario no autenticado');
      }

      // Generar un ID único para el avistamiento si no existe
      if (!avistamiento.id) {
        avistamiento.id = new Date().getTime().toString(); // Usar un timestamp como ID
      }

      // Agregar el UID del usuario al avistamiento
      avistamiento.usuarioId = uid;

      // Crear un archivo JSON con el avistamiento
      const avistamientoData = JSON.stringify(avistamiento);
      const blob = new Blob([avistamientoData], { type: 'application/json' });

      // Generar el nombre de archivo basado en el ID único
      const nombreArchivo = `avistamientosCompartidos/${avistamiento.id}_avistamiento.json`;

      // Subir el archivo JSON a Firebase Storage
      const storageRef = this.aveStorage.ref(nombreArchivo);
      const task = this.aveStorage.upload(nombreArchivo, blob);
      await firstValueFrom(task.snapshotChanges());

      console.log('Avistamiento guardado en Storage:', nombreArchivo);
      this.presentToast('Avistamiento compartido al público');
    } catch (error) {
      console.error('Error al guardar el avistamiento como compartido:', error);
    }
  }

  /**
   * @function compartirAvistamiento
   * @description Comparte el avistamiento
   * @param avistamiento 
   */
  async compartirAvistamiento(avistamiento: Avistamiento) {
    const shareData = {
      title: 'Avistamiento de Aves',
      text: `Avisté un(a) ${avistamiento.nombre} el ${avistamiento.fecha} en ${avistamiento.descripcion}.`,
      dialogTitle: 'Compartir avistamiento',
      url: avistamiento.imagen || ''
    };

    try {
      const shareResult = await Share.share(shareData);
      if (shareResult) {
        await this.presentAlertConfirm(avistamiento);
      }
    } catch (error) {
      console.error('Error al compartir el avistamiento:', error);
      this.presentToast('Error al compartir el avistamiento.');
    }
  }

  /**
   * @function presentAlertConfirm
   * @description Muestra un diálogo de confirmación para compartir el avistamiento
   * @param avistamiento 
   */
  async presentAlertConfirm(avistamiento: Avistamiento) {
    const alert = await this.alertController.create({
      header: 'Compartir avistamiento',
      message: '¿Deseas compartir tu avistamiento de manera pública?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Compartir cancelado');
          }
        }, {
          text: 'Compartir',
          handler: () => {
            this.marcarComoCompartido(avistamiento);
            this.presentToast('Avistamiento compartido de manera pública');
          }
        }
      ]
    });

    await alert.present();
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

  /**
   * @function ionViewWillLeave
   * @description Cancela la suscripción al Subject al salir de la vista
   */
  ionViewWillLeave() {
    this.unsubscribe$.next(); // Notifica a todas las suscripciones para que se completen
    this.unsubscribe$.complete(); // Completa el Subject
  }
}
