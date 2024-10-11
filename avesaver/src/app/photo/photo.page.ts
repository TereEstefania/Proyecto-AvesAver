import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service'; // Importa tu servicio
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
})
export class PhotoPage implements OnInit {

  public photoUrl: string | undefined;

  constructor(public photoService: PhotoService, private navCtrl: NavController) { }

  ngOnInit() {
    this.photoService.cargarFotos();
  }

/**
 * @function sacarFoto
 * @description esta función invoca al servicio 'photoService' para tomar una foto.
 */
  sacarFoto() {
    this.photoService.tomarFoto();
  }

/**
 * @function eliminarFoto
 * @param rutaFirebase de tipo string corresponde a la ruta dentro de firebase storage donde la foto del usuario está almacenada.
 * @description esta función permite que el usuario autenticado pueda eliminar una foto de su galeria.
 */  
  eliminarFoto(rutaFirebase: string) {
    this.photoService.eliminarFoto(rutaFirebase);
  }

  seleccionarFoto(urlImagen: string) {
    this.photoService.seleccionarFoto(urlImagen);
    this.navCtrl.back(); // Regresa a la página anterior (AgregarPage)
  }

  get imagenSeleccionada() {
    return this.photoService.imagenSeleccionada;
  }

  

}
