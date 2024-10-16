import { Component, OnInit } from '@angular/core';
import { AvistamientosService } from '../services/avistamientos.service';
import { Avistamiento } from '../models/avistamiento.model';
import { NavController } from '@ionic/angular';
import { PhotoService } from '../services/photo.service';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage implements OnInit {

  fechaSeleccionada: string | null = null; // Variable para almacenar la fecha seleccionada
  mostrarCalendario = false; // Controla la visibilidad del calendario

  avistamiento: Avistamiento = { // Inicializa el objeto avistamiento
    nombre: '',
    fecha: '',
    descripcion: '',
    imagen: ''
  }

  public imagenSeleccionada: string | undefined; // Aquí declaras la propiedad
  isEditMode = false; // Variable para saber si estamos en modo edición

  constructor(
    private avistamientosService: AvistamientosService, 
    private navCtrl: NavController, 
    private photoService: PhotoService, 
    private toastController: ToastController,
    private route: ActivatedRoute,  // Agregar ActivatedRoute para obtener el ID si existe
    private authService: AuthenticationService
  ) {}

  async ngOnInit() {
    const avistamientoId = this.route.snapshot.paramMap.get('id'); // Obtén el ID del avistamiento desde la ruta
    if (avistamientoId) {
      const uid = await this.authService.obtenerUid(); // Obtén el UID del usuario
      if (uid) { // Verifica que uid no sea null
        this.avistamiento = await this.avistamientosService.obtenerAvistamiento(uid, avistamientoId); // Obtén el avistamiento
        this.imagenSeleccionada = this.avistamiento.imagen; // Establece la imagen
        this.isEditMode = true; // Establecer que estamos en modo de edición
      } else {
        console.error('Usuario no autenticado'); // Maneja el caso donde el UID es null
      }
    } else {
      console.error('ID de avistamiento no proporcionado'); // Maneja el caso donde el ID es null
    }
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

  /**
   * @function guardarAvistamiento
   * @description Guarda o edita un avistamiento dependiendo del modo (agregar o editar)
   */
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
        if (!this.photoService.imagenSeleccionada && !this.avistamiento.imagen) {
            console.error('Debe seleccionar una imagen antes de guardar el avistamiento.');
            this.presentToast('Debe seleccionar una imagen antes de guardar el avistamiento.');
            return;
        }

        // Si estamos en modo de edición, actualizamos el avistamiento
        if (this.isEditMode) {
            if (!this.avistamiento.id) {
                console.error('ID de avistamiento no válido.');
                this.presentToast('ID de avistamiento no válido.');
                return;
            }
            // Mantener la imagen existente si no se selecciona una nueva
            this.avistamiento.imagen = this.photoService.imagenSeleccionada || this.avistamiento.imagen; 
            await this.avistamientosService.editarAvistamiento(this.avistamiento.id, this.avistamiento);
            this.presentToast('Avistamiento editado exitosamente');
        } else {
            // Crear un nuevo avistamiento
            this.avistamiento.imagen = this.photoService.imagenSeleccionada || ''; // Asigna una cadena vacía si es undefined
            await this.avistamientosService.guardarAvistamiento(this.avistamiento);
            this.presentToast('Avistamiento guardado exitosamente');
        }

        // Limpia el avistamiento después de guardar
        this.avistamiento = { nombre: '', fecha: '', descripcion: '', imagen: '' }; 
        this.photoService.imagenSeleccionada = undefined; // Resetea la imagen seleccionada

        // Oculta la imagen seleccionada en la página Agregar
        this.imagenSeleccionada = undefined; 

    } catch (error) {
        console.error('Error al guardar el avistamiento:', error);
    }
  }

  /**
   * @function ionViewWillEnter
   * @description Actualiza la imagen seleccionada cada vez que la vista es visible
   */
  ionViewWillEnter() {
    this.imagenSeleccionada = this.photoService.imagenSeleccionada; 
  }

  /**
   * @function presentToast
   * @param message Mensaje que se mostrará en el toast
   * @description Muestra un mensaje emergente en la parte superior de la pantalla
   */
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
