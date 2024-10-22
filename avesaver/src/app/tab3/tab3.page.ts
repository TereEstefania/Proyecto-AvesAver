import { Component } from '@angular/core';
import { AvistamientosService } from '../services/avistamientos.service';
import { PhotoService } from '../services/photo.service';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Avistamiento } from '../models/avistamiento.model';
import { AuthenticationService } from '../services/authentication.service';
import { Share } from '@capacitor/share';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  avistamientos: Avistamiento[] = [];
  firestore: any;
  

  constructor( 
    private navCtrl: NavController, 
    private auth: AuthenticationService,
    private avistamientosService: AvistamientosService,
    private toastController: ToastController,
    private aveStorage: AngularFireStorage,
    private authService: AuthenticationService,
    private alertController: AlertController) {
    }

    async ngOnInit() {
      await this.cargarAvistamientos(); // Carga avistamientos al inicializar
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

async ionViewWillEnter() {
  await this.cargarAvistamientos(); // Recarga avistamientos cuando la vista se vuelve visible
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
      this.cargarAvistamientos(); // Recarga la lista tras eliminar
      console.log('Avistamiento eliminado:', avistamiento)
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
 * @function marcarComoCompartido crea una copia del avistamiento que se marco como compartido y lo almacena en 'avistamientos compartidos' 
 * tal archivo es compartido por todos los usuarios de la aplicacion.
 * @param avistamiento 
 */
async marcarComoCompartido(avistamiento: Avistamiento) {
    try {
      const uid = await this.authService.obtenerUid();
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
  
      // Generar el nombre de archivo basado en el ID único, apuntando a "avistamientos_compartidos"
      const nombreArchivo = `avistamientosCompartidos/${avistamiento.id}_avistamiento.json`;
  
      // Subir el archivo JSON a Firebase Storage en la carpeta "avistamientos_compartidos"
      const storageRef = this.aveStorage.ref(nombreArchivo);
      const task = this.aveStorage.upload(nombreArchivo, blob);
      await firstValueFrom(task.snapshotChanges());
  
      console.log('Avistamiento guardado en Storage en la carpeta "avistamientosCompartidos":', nombreArchivo);
      this.presentToast('Avistamiento compartido al publico');
    } catch (error) {
      console.error('Error al guardar el avistamiento como compartido:', error);
    }
  
  

}

/**
 * 
 * @param avistamiento 
 */
async compartirAvistamiento(avistamiento: Avistamiento) {
  const shareData = {
    title: 'Avistamiento de Aves',
    text: `Avisté un(a) ${avistamiento.nombre} el ${avistamiento.fecha} en ${avistamiento.descripcion}.`,
    dialogTitle: 'Compartir avistamiento',
    url: ''
  };
 
  if (avistamiento.imagen) {
    // Si el avistamiento tiene una foto, agregamos la URL de la imagen
    shareData.url = avistamiento.imagen;
  }
  try {
    // Primero, compartir usando Capacitor Share
    const shareResult = await Share.share(shareData);

    // Si la acción de compartir fue exitosa, mostrar el AlertController
    if (shareResult) {
      await this.presentAlertConfirm(avistamiento);
    }
  } catch (error) {
    console.error('Error al compartir el avistamiento:', error);
    this.presentToast('Error al compartir el avistamiento:');
  }

}

/**
 * 
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
          // Después de compartir, guardamos el avistamiento en Firestore
          this.marcarComoCompartido(avistamiento);
          this.presentToast('Avistamiento compartido de manera publica');
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
}
