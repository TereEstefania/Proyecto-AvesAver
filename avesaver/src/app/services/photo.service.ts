import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Preferences } from '@capacitor/preferences';


export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  public photos: UserPhoto[] = [];

  constructor() {}

  // Método para tomar una foto usando la cámara
  public async takePhoto() {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri, 
      source: CameraSource.Camera, 
      quality: 100, 
    });

    // Almacena la foto capturada en la lista
    this.photos.unshift({
      filepath: new Date().getTime().toString(),
      webviewPath: photo.webPath,
    });

    // Guardar la lista de fotos
    this.savePhotos();
  }

  // Método para guardar fotos localmente
  private async savePhotos() {
    console.log('Se guardó la foto')
    await Preferences.set({
      key: 'photos',
      value: JSON.stringify(this.photos),
    });
  }
}

