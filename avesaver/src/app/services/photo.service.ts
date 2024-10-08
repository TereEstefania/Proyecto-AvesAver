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

  constructor(private storage: AngularFireStorage, private aveService: AuthenticationService) {}

  // Método para tomar una foto y subirla a Firebase Storage
  public async tomarFoto() {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    // Sube la foto a Firebase Storage y guarda la URL
    await this.uploadPhoto(photo.webPath!);
  }

  private async uploadPhoto(urlImagen: string) {
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
  
      // Subir el Blob a Firebase Storage
      const task = this.storage.upload(rutaStore, blob);
  
      // Espera a que la tarea de subida complete
      await firstValueFrom(task.snapshotChanges());
  
      // Espera 2 segundos 
      await new Promise(resolve => setTimeout(resolve, 2000)); 
  
      // Obtener la URL de descarga después de la subida
      const downloadURL = await firstValueFrom(rutaRef.getDownloadURL());
      
      // Almacena la URL de Firebase
      this.photos.unshift({
        rutaFirebase: rutaStore,
        urlImagen: downloadURL,
      });
      console.log("Foto subida exitosamente, URL:", downloadURL);
      
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  }

  // Método para cargar las fotos desde Firebase Storage
  private async cargarFotosFirebase() {
  const photosList: UsuarioFoto[] = [];

  const uid = await this.aveService.obtenerUid(); 
    if (!uid) {
      throw new Error("El usuario no está autenticado");
    }

    // Obtener una referencia al storage, pero ahora según el UID del usuario
    const ref = this.storage.ref(`users/${uid}/photos`);

    // Usar listAll para obtener los elementos y convertir el Observable a Promise
    const result = await firstValueFrom(ref.listAll());

  // Iterar sobre los elementos
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

  // Método para cargar las fotos
  public async cargarFotos() {
    await this.cargarFotosFirebase(); 
  }
}


