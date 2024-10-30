import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthenticationService } from './authentication.service';
import { firstValueFrom } from 'rxjs';
import { Lista } from '../models/lista.model'; // Asegúrate de importar tu modelo de lista

@Injectable({
  providedIn: 'root'
})
export class ListasService {
  constructor(
    private aveStorage: AngularFireStorage,
    private authService: AuthenticationService
  ) {}

  /**
   * Guardar una nueva lista en Firebase Storage
   * @param lista - La lista que se va a guardar
   */
  async guardarLista(lista: Lista): Promise<boolean> {
    try {
      const uid = await this.authService.obtenerUid();
      const nombreUser = await this.authService.getUsuario();
  
      if (!uid) {
        throw new Error('Usuario no autenticado');
      }
  
      // Generar un ID único para la lista si no existe
      if (!lista.id) {
        lista.id = new Date().getTime().toString(); // Usar un timestamp como ID
      }
  
      // Agregar el UID y el nombre del usuario a la lista
      lista.usuarioId = uid;
      lista.nombreUser = nombreUser ?? 'usuario anónimo';
  
      // Crear un archivo JSON con la lista
      const listaData = JSON.stringify(lista);
      const blob = new Blob([listaData], { type: 'application/json' });
  
      // Generar el nombre de archivo basado en el ID único
      const nombreArchivo = `users/${uid}/listas/${lista.id}_lista.json`;
  
      // Subir el archivo JSON a Firebase Storage
      const task = this.aveStorage.upload(nombreArchivo, blob);
      const snapshot = await firstValueFrom(task.snapshotChanges());
  
      // Verificar si la tarea se completó exitosamente
      if (snapshot && snapshot.bytesTransferred === snapshot.totalBytes) {
        console.log('Lista guardada en Storage:', nombreArchivo);
        return true; // Devuelve verdadero si se guarda correctamente
      } else {
        throw new Error('La tarea no se completó correctamente.');
      }
    } catch (error) {
      throw error; // Vuelve a lanzar el error para manejarlo en el método que llama
    }
  }
  
  
  

  /**
   * Obtener todas las listas de un usuario
   * @param uid - El UID del usuario autenticado
   * @returns Una lista de listas del usuario
   */
  async obtenerListasPorUsuario(uid: string): Promise<Lista[]> {
    if (!uid) {
      throw new Error('UID de usuario no proporcionado');
    }

    const ref = this.aveStorage.ref(`users/${uid}/listas`);
    const result = await firstValueFrom(ref.listAll());

    const listasList: Lista[] = [];

    for (const item of result.items) {
      try {
        const listaJSON = await item.getDownloadURL();
        const response = await fetch(listaJSON);

        if (!response.ok) {
          throw new Error(`Error al obtener lista: ${response.statusText}`);
        }

        const listaData = await response.json();
        listasList.push(listaData);
      } catch (error) {
        console.error(`Error al procesar la lista ${item.fullPath}:`, error);
      }
    }

    return listasList;
  }

  /**
   * Eliminar una lista por su ID
   * @param listaId - El ID de la lista a eliminar
   */
  async eliminarLista(listaId: string) {
    try {
      const uid = await this.authService.obtenerUid();
      if (!uid) {
        throw new Error('Usuario no autenticado');
      }

      if (!listaId) {
        throw new Error('ID de lista no proporcionado');
      }

      // Crear la referencia al archivo JSON de la lista en Firebase Storage
      const storageRef = this.aveStorage.ref(`users/${uid}/listas/${listaId}_lista.json`);

      // Eliminar el archivo de la lista
      await storageRef.delete();

      console.log(`Lista ${listaId} eliminada correctamente.`);
    } catch (error) {
      console.error('Error al eliminar la lista:', error);
    }
  }

  /**
   * Editar una lista existente
   * @param listaId - El ID de la lista a editar
   * @param listaEditada - El objeto con los datos actualizados de la lista
   */
  async editarLista(listaId: string, listaEditada: Lista) {
    try {
      const uid = await this.authService.obtenerUid();
      if (!uid) {
        throw new Error('Usuario no autenticado');
      }

      if (!listaId) {
        throw new Error('ID de lista no proporcionado');
      }

      // Crear un archivo JSON con la lista actualizada
      const listaData = JSON.stringify(listaEditada);
      const blob = new Blob([listaData], { type: 'application/json' });

      // Referencia al archivo de la lista en Firebase Storage
      const nombreArchivo = `users/${uid}/listas/${listaId}_lista.json`;
      const storageRef = this.aveStorage.ref(nombreArchivo);

      // Subir el archivo JSON actualizado a Firebase Storage
      const task = this.aveStorage.upload(nombreArchivo, blob);
      await firstValueFrom(task.snapshotChanges());

      console.log(`Lista ${listaId} editada correctamente.`);
    } catch (error) {
      console.error('Error al editar la lista:', error);
      throw error;
    }
  }
}
