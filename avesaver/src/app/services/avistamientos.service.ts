import { Injectable } from '@angular/core';
import { Avistamiento } from '../models/avistamiento.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthenticationService } from './authentication.service';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class AvistamientosService {

  constructor(
    private aveStorage: AngularFireStorage,
    private authService: AuthenticationService
  ) { }

  async guardarAvistamiento(avistamiento: Avistamiento) {
    try {
      // Obtener el UID del usuario autenticado
      const uid = await this.authService.obtenerUid();
      if (!uid) {
        throw new Error('Usuario no autenticado');
      }

      // Agregar el UID del usuario al avistamiento
      avistamiento.usuarioId = uid;

      // Crear un archivo JSON con el avistamiento
      const avistamientoData = JSON.stringify(avistamiento);
      const blob = new Blob([avistamientoData], { type: 'application/json' });

      // Generar un nombre único para el archivo
      const nombreArchivo = `users/${uid}/avistamientos/${new Date().getTime()}_avistamiento.json`;

      // Referencia a Firebase Storage
      const storageRef = this.aveStorage.ref(nombreArchivo);

      // Subir el archivo JSON a Firebase Storage
      const task = this.aveStorage.upload(nombreArchivo, blob);
      await firstValueFrom(task.snapshotChanges());

      console.log('Avistamiento guardado en Storage:', nombreArchivo);
    } catch (error) {
      console.error('Error al guardar el avistamiento en Firebase Storage:', error);
    }
  }
}


