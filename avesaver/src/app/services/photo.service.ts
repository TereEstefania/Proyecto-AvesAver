import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { firstValueFrom } from 'rxjs';

export interface UsuarioFoto {
  rutaFirebase: string;
  urlImagen?: string; // Esta será la URL de Firebase
}

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  public photos: UsuarioFoto[] = []; // Lista para almacenar las URLs de las imágenes

  constructor(private storage: AngularFireStorage) {}

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
  
      const filePath = `photos/${new Date().getTime().toString()}`;
      const fileRef = this.storage.ref(filePath);
  
      // Subir el Blob a Firebase Storage
      const task = this.storage.upload(filePath, blob);
  
      // Espera a que la tarea de subida complete
      await firstValueFrom(task.snapshotChanges());
  
      // Espera 2 segundos (esto es opcional)
      await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2 segundos
  
      // Obtener la URL de descarga después de la subida
      const downloadURL = await firstValueFrom(fileRef.getDownloadURL());
      
      // Almacena la URL de Firebase
      this.photos.unshift({
        rutaFirebase: filePath,
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

  // Obtener una referencia al storage
  const ref = this.storage.ref('photos');

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

  this.photos = photosList; // Almacena las fotos en el array
  console.log(this.photos); // Aquí deberías ver las fotos cargadas
}

public async eliminarFoto(rutaFirebase: string) {
  try {
    // Eliminar la imagen de Firebase Storage
    await this.storage.ref(rutaFirebase).delete();

    // Actualizar la lista local de fotos
    this.photos = this.photos.filter(photo => photo.rutaFirebase !== rutaFirebase);
    console.log("Foto eliminada exitosamente:", rutaFirebase);
    console.log(this.photos);
  } catch (error) {
    console.error('Error al eliminar la imagen:', error);
  }
}

  // Método para cargar las fotos
  public async cargarFotos() {
    await this.cargarFotosFirebase(); // Cargar las fotos desde Firebase
  }
}


