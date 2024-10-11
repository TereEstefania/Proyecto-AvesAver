import { Component, OnInit } from '@angular/core';
import { AvistamientosService } from '../services/avistamientos.service';
import { Avistamiento } from '../models/avistamiento.model';
import { NavController } from '@ionic/angular';
import { PhotoService } from '../services/photo.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage implements OnInit {

  fechaSeleccionada: string | null = null;
  mostrarCalendario = false;

  avistamiento: Avistamiento = {
    nombre: '',
    fecha: '',
    descripcion: '',
    imagen: ''
  }

  public imagenSeleccionada: string | undefined; // Aquí declaras la propiedad

  constructor(private avistamientosService: AvistamientosService, private navCtrl: NavController, private photoService: PhotoService, private toastController: ToastController) {}

  ngOnInit() {
    this.imagenSeleccionada = this.photoService.imagenSeleccionada;
    
  }

/**
 * @function elegirFecha
 * @param event tipo any, contiene el valor de la fecha seleccionada por el usuario
 * @description esta función maneja la selección de una fecha en el calendario.
 */
elegirFecha(event: any) {
  this.fechaSeleccionada = event.detail.value;
  this.avistamiento.fecha = this.fechaSeleccionada ? this.fechaSeleccionada : ''; // Establece la fecha en el avistamiento
  this.mostrarCalendario = false; 
}

/**
 * @function abrirCalendario
 * @description esta funcion muestra el calendario cuando se presiona el input fecha.
 */
  abrirCalendario() {
    this.mostrarCalendario = true;
  }

/**
 * @function cerrarCalendario
 * @description esta función permite el cierre del calendario cuando el usuario selecciona una fecha o cuando presiona la pantalla por fuera del calendario
 */
  cerrarCalendario() {
    this.mostrarCalendario = false;
  }

  irAPhotoPage() {
    this.navCtrl.navigateForward('/photo'); // Navegar a la página donde se seleccionan las fotos
  }

  async guardarAvistamiento() {
    try {
      // Validar que los campos obligatorios estén completos
      if (!this.avistamiento.nombre) {
        console.error('El nombre es obligatorio.');
        this.presentToast('El nombre es obligatorio.');
        return;
      }
  
      if (!this.avistamiento.fecha) {
        console.error('La fecha es obligatoria.');
        this.presentToast('La fecha es obligatoria.');
        return;
      }
  
      // Asegúrate de que la imagen esté seleccionada antes de guardar
      if (!this.photoService.imagenSeleccionada) {
        console.error('Debe seleccionar una imagen antes de guardar el avistamiento.');
        this.presentToast('Debe seleccionar una imagen antes de guardar el avistamiento.');
        return;
      }
  
      // Establece la imagen seleccionada en el objeto avistamiento
      this.avistamiento.imagen = this.photoService.imagenSeleccionada;
  
      // Guarda el avistamiento
      await this.avistamientosService.guardarAvistamiento(this.avistamiento);
      this.presentToast('Avistamiento guardado exitosamente');
      console.log('Avistamiento guardado');
  
      // Limpia el avistamiento después de guardar
      this.avistamiento = { nombre: '', fecha: '', descripcion: '', imagen: '' }; 
      this.photoService.imagenSeleccionada = undefined; // Resetea la imagen seleccionada
  
      // Oculta la imagen seleccionada en la página Agregar
      this.imagenSeleccionada = undefined; // Asegúrate de tener esta propiedad en la clase
  
    } catch (error) {
      console.error('Error al guardar el avistamiento:', error);
    }
  }
  

  ionViewWillEnter() {
    this.imagenSeleccionada = this.photoService.imagenSeleccionada; 
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }


}
