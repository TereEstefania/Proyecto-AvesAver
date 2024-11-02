import { Injectable } from '@angular/core';
import { Avistamiento } from '../models/avistamiento.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthenticationService } from './authentication.service';
import { firstValueFrom, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvistamientosService {
  private avistamientosRecargar = new BehaviorSubject<void>(undefined);
  public recargarAvistamientos$ = this.avistamientosRecargar.asObservable(); // Exponer el Subject

  constructor(
    private aveStorage: AngularFireStorage,
    private authService: AuthenticationService
  ) {}

/**
* @function guardarAvistamiento
* Guardar un nuevo avistamiento en Firebase Storage
* @param  avistamiento Avistamiento, corresponde al avistamiento que se desea guardar
* @description esta funcón permite guardar el avistamiento en fireStorage
*/
  async guardarAvistamiento(avistamiento: Avistamiento) {
    try {
      const uid = await this.authService.obtenerUid();
      const nombreUser = await this.authService.getUsuario(); 

      if (!uid) {
        throw new Error('Usuario no autenticado');
      }

      if (!avistamiento.id) {
        avistamiento.id = new Date().getTime().toString();
      }

      avistamiento.usuarioId = uid;
      avistamiento.nombreUser = nombreUser ?? 'usuario anonimo'; 

      const avistamientoData = JSON.stringify(avistamiento);
      const blob = new Blob([avistamientoData], { type: 'application/json' });

      const nombreArchivo = `users/${uid}/avistamientos/${avistamiento.id}_avistamiento.json`;

      const storageRef = this.aveStorage.ref(nombreArchivo);
      const task = this.aveStorage.upload(nombreArchivo, blob);
      await firstValueFrom(task.snapshotChanges());

      console.log('Avistamiento guardado en Storage:', nombreArchivo);
    } catch (error) {
      console.error('Error al guardar el avistamiento en Firebase Storage:', error);
    }
  }

/**
* @function obtenerAvistamientosPorUsuario
* @param uid corresponde al uid especifico del usuario
* @returns Una lista de avistamientos del usuario
* @description esta función permite obtener la lista de avistamientos de un usuario especifico
*/
  async obtenerAvistamientosPorUsuario(uid: string): Promise<Avistamiento[]> {
    if (!uid) {
      throw new Error('UID de usuario no proporcionado');
    }

    const ref = this.aveStorage.ref(`users/${uid}/avistamientos`);
    const result = await firstValueFrom(ref.listAll());

    const avistamientosList: Avistamiento[] = [];

    for (const item of result.items) {
      try {
        const avistamientoJSON = await item.getDownloadURL();
        const response = await fetch(avistamientoJSON);

        if (!response.ok) {
          throw new Error(`Error al obtener avistamiento: ${response.statusText}`);
        }

        const avistamientoData = await response.json();
        avistamientosList.push(avistamientoData);
      } catch (error) {
        console.error(`Error al procesar el avistamiento ${item.fullPath}:`, error);
      }
    }

    return avistamientosList;
  }

/**
* @function obtenerAvistamientosCompartidos 
* @returns Una lista de avistamientos compartidos
* @description esta función  retorna los avistamientos compartidos por los usuarios que usan la aplicación
*/
  async obtenerAvistamientosCompartidos(): Promise<Avistamiento[]> {
    const ref = this.aveStorage.ref(`avistamientosCompartidos`);
    const result = await firstValueFrom(ref.listAll());

    const avistamientosList: Avistamiento[] = [];

    for (const item of result.items) {
      try {
        const avistamientoJSON = await item.getDownloadURL();
        const response = await fetch(avistamientoJSON);

        if (!response.ok) {
          throw new Error(`Error al obtener avistamiento: ${response.statusText}`);
        }

        const avistamientoData = await response.json();
        avistamientosList.push(avistamientoData);
      } catch (error) {
        console.error(`Error al procesar el avistamiento ${item.fullPath}:`, error);
      }
    }

    return avistamientosList;
  }

/**
* @function eliminarAvistamiento
* @param avistamientoId corresponde al ID del avistamiento a eliminar
* @description esta función permite eliminar un avistamiento específico de un usuario y de los avistamientos compartidos, si existe en ambos lugares
*/
async eliminarAvistamiento(avistamientoId: string) {
  try {
    const uid = await this.authService.obtenerUid();
    if (!uid) {
      throw new Error('Usuario no autenticado');
    }

    if (!avistamientoId) {
      throw new Error('ID de avistamiento no proporcionado');
    }

    // Elimina el avistamiento del almacenamiento del usuario
    const storageRefUser = this.aveStorage.ref(`users/${uid}/avistamientos/${avistamientoId}_avistamiento.json`);
    await storageRefUser.delete();

    console.log(`Avistamiento ${avistamientoId} eliminado correctamente del usuario.`);

    // Elimina el avistamiento compartido, si existe
    const storageRefCompartidos = this.aveStorage.ref(`avistamientosCompartidos/${avistamientoId}_avistamiento.json`);
    await storageRefCompartidos.delete();

    console.log(`Avistamiento ${avistamientoId} eliminado correctamente de los compartidos.`);

    this.emitirRecarga(); 
  } catch (error) {
    console.error('Error al eliminar el avistamiento:', error);
  }
}

  /**
  * @function editarAvistamiento
  * Editar un avistamiento existente
  * @param avistamientoId corresponde al id del avistamiento que se desea editar
  * @param avistamientoEditado corresponde al avistamiento con los datos actualizados
  * @description esta función permite editar información de un avistamiento 
  */
  async editarAvistamiento(avistamientoId: string, avistamientoEditado: Avistamiento) {
    try {
      const uid = await this.authService.obtenerUid();
      if (!uid) {
        throw new Error('Usuario no autenticado');
      }

      if (!avistamientoId) {
        throw new Error('ID de avistamiento no proporcionado');
      }

      const avistamientoData = JSON.stringify(avistamientoEditado);
      const blob = new Blob([avistamientoData], { type: 'application/json' });

      const nombreArchivo = `users/${uid}/avistamientos/${avistamientoId}_avistamiento.json`;
      const storageRef = this.aveStorage.ref(nombreArchivo);

      const task = this.aveStorage.upload(nombreArchivo, blob);
      await firstValueFrom(task.snapshotChanges());

      console.log(`Avistamiento ${avistamientoId} editado correctamente.`);
      this.emitirRecarga();
    } catch (error) {
      console.error('Error al editar el avistamiento:', error);
      throw error;
    }
  }

  /**
  * @function obtenerAvistamiento
  * @param avistamientoId corresponde al ID del avistamiento que se desea obtener
  * @param uid corresponde al UID del usuario autenticado
  * @returns Una promesa que resuelve con el avistamiento obtenido desde fireStorage
  */
  async obtenerAvistamiento(uid: string, avistamientoId: string): Promise<Avistamiento> {
    try {
      if (!uid) {
        throw new Error('UID de usuario no proporcionado');
      }

      if (!avistamientoId) {
        throw new Error('ID de avistamiento no proporcionado');
      }

      const ref = this.aveStorage.ref(`users/${uid}/avistamientos/${avistamientoId}_avistamiento.json`);
      
      const avistamientoURL = await firstValueFrom(ref.getDownloadURL());

      const response = await fetch(avistamientoURL);
      if (!response.ok) {
        throw new Error(`Error al obtener avistamiento: ${response.statusText}`);
      }

      const avistamientoData = await response.json();
      return avistamientoData as Avistamiento;

    } catch (error) {
      console.error('Error al obtener el avistamiento:', error);
      throw error;
    }
  }

  /**
  * @function emitirRecarga
  * @description esta funcion emite un evento para recargar la lista de avistamientos
  */
  emitirRecarga() {
    this.avistamientosRecargar.next(); 
  }
}





