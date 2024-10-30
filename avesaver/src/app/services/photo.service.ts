import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { firstValueFrom } from 'rxjs';
import { AuthenticationService } from './authentication.service';

export interface UsuarioFoto {
  rutaFirebase: string;
  urlImagen?: string; // Esta será la URL de Firebase
}

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  public photos: UsuarioFoto[] = []; // Lista para almacenar las URLs de las imágenes
  public imagenSeleccionada: string | undefined; // Almacena la imagen seleccionada

  constructor(private storage: AngularFireStorage, private aveService: AuthenticationService) {}

  /**
  * @function tomarFoto
  * @description esta función permite que el usuario pueda tomar una foto usando la cámara del dispositivo y luego subirla a firebase Storage.
  */
  public async tomarFoto() {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    await this.subirFoto(photo.webPath!);
  }

  /**
  * @function subirFoto
  * @param urlImagen de tipo string es la URL local de la imagen capturada
  * @description esta función permite crear una ruta única para almacenar la imagen capturada dentro de la carpeta 'photos' del usuario autenticado en Firebase Storage. Si el usuario no está autenticado se lanza un mensaje de error.
  */
  private async subirFoto(urlImagen: string) {
    try {
      const response = await fetch(urlImagen);
      if (!response.ok) {
        throw new Error("No se pudo obtener el blob de la imagen");
      }
      const blob = await response.blob();

      const uid = await this.aveService.obtenerUid();
      if (!uid) {
        throw new Error('El usuario no está autenticado');
      }
  
      const rutaStore = `users/${uid}/photos/${new Date().getTime().toString()}`;
      const rutaRef = this.storage.ref(rutaStore);
  
      const task = this.storage.upload(rutaStore, blob);
  
      await firstValueFrom(task.snapshotChanges());
  
      await new Promise(resolve => setTimeout(resolve, 2000)); 
  
      const downloadURL = await firstValueFrom(rutaRef.getDownloadURL());
      
      this.photos.unshift({
        rutaFirebase: rutaStore,
        urlImagen: downloadURL,
      });
      console.log("Foto subida exitosamente, URL:", downloadURL);
      
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  }

  /**
  * @function cargarFotosFirebase
  * @description esta función carga las fotos del usuario autenticado desde Firebase Storage.
  */
  private async cargarFotosFirebase() {
    const photosList: UsuarioFoto[] = [];

    const uid = await this.aveService.obtenerUid(); 
    if (!uid) {
      throw new Error("El usuario no está autenticado");
    }

    const ref = this.storage.ref(`users/${uid}/photos`);

    const result = await firstValueFrom(ref.listAll());

    for (const item of result.items) {
      const url = await item.getDownloadURL();
      photosList.push({
        rutaFirebase: item.fullPath,
        urlImagen: url,
      });
    }

    this.photos = photosList; 
    console.log(this.photos);
  }

  /**
  * @function eliminarFoto
  * @param rutaFirebase de tipo string corresponde a la ruta en Firebase Storage donde está almacenada la foto a eliminar.
  * @description esta función elimina la imagen de Firebase Storage de forma permanente y se actualiza la lista de fotos local para luego crear una nueva lista de fotos excluyendo la eliminada.
  */
  public async eliminarFoto(rutaFirebase: string) {
    try {
      await this.storage.ref(rutaFirebase).delete();

      this.photos = this.photos.filter(photo => photo.rutaFirebase !== rutaFirebase);
      console.log("Foto eliminada exitosamente:", rutaFirebase);
      console.log(this.photos);
    } catch (error) {
    console.error('Error al eliminar la imagen:', error);
    }
  } 

  /**
  * @function cargarFotos
  * @description Esta función desencadena la carga de fotos almacenadas en Firebase Storage.
  */
  public async cargarFotos() {
    await this.cargarFotosFirebase(); 
  }

  /**
  * @function seleccionarFoto
  * @param urlImagen de tipo string corresponde a la url de la imagen seleccionada por el usuario
  * @description esta función almacena la url de la imagen en la variable imagenSeleccionada y muestra en consola la url de la misma.
  */
  seleccionarFoto(urlImagen: string) {
    this.imagenSeleccionada = urlImagen;
    console.log('Imagen seleccionada:', urlImagen);
  }

}


