import { Injectable } from '@angular/core';
import { Avistamiento } from '../models/avistamiento.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthenticationService } from './authentication.service';
import { firstValueFrom, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvistamientosService {
  private avistamientosRecargarSubject = new BehaviorSubject<void>(undefined);
  public recargarAvistamientos$ = this.avistamientosRecargarSubject.asObservable(); // Exponer el Subject

  constructor(
    private aveStorage: AngularFireStorage,
    private authService: AuthenticationService
  ) {}

  /**
   * Guardar un nuevo avistamiento en Firebase Storage
   * @param avistamiento - El avistamiento que se va a guardar
   */
  async guardarAvistamiento(avistamiento: Avistamiento) {
    try {
      const uid = await this.authService.obtenerUid();
      const nombreUser = await this.authService.getUsuario(); // Función para obtener el nombre del usuario

      if (!uid) {
        throw new Error('Usuario no autenticado');
      }

      // Generar un ID único para el avistamiento si no existe
      if (!avistamiento.id) {
        avistamiento.id = new Date().getTime().toString(); // Usar un timestamp como ID
      }

      // Agregar el UID y el nombre del usuario al avistamiento
      avistamiento.usuarioId = uid;
      avistamiento.nombreUser = nombreUser ?? 'usuario anonimo'; // Añadir el nombre del usuario

      // Crear un archivo JSON con el avistamiento
      const avistamientoData = JSON.stringify(avistamiento);
      const blob = new Blob([avistamientoData], { type: 'application/json' });

      // Generar el nombre de archivo basado en el ID único
      const nombreArchivo = `users/${uid}/avistamientos/${avistamiento.id}_avistamiento.json`;

      // Subir el archivo JSON a Firebase Storage
      const storageRef = this.aveStorage.ref(nombreArchivo);
      const task = this.aveStorage.upload(nombreArchivo, blob);
      await firstValueFrom(task.snapshotChanges());

      console.log('Avistamiento guardado en Storage:', nombreArchivo);
    } catch (error) {
      console.error('Error al guardar el avistamiento en Firebase Storage:', error);
    }
  }

  /**
   * Obtener todos los avistamientos de un usuario
   * @param uid - El UID del usuario autenticado
   * @returns Una lista de avistamientos del usuario
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
   * Obtener los avistamientos compartidos que se encuentran en el almacenamiento 'avistamientosCompartidos'
   * @returns Una lista de avistamientos compartidos
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
   * Eliminar un avistamiento por su ID
   * @param avistamientoId - El ID del avistamiento a eliminar
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

      // Crear la referencia al archivo JSON del avistamiento en Firebase Storage
      const storageRef = this.aveStorage.ref(`users/${uid}/avistamientos/${avistamientoId}_avistamiento.json`);

      // Eliminar el archivo del avistamiento
      await storageRef.delete();

      console.log(`Avistamiento ${avistamientoId} eliminado correctamente.`);
      this.emitirRecarga(); // Emitir evento de recarga después de eliminar
    } catch (error) {
      console.error('Error al eliminar el avistamiento:', error);
    }
  }

  /**
   * Editar un avistamiento existente
   * @param avistamientoId - El ID del avistamiento a editar
   * @param avistamientoEditado - El objeto con los datos actualizados del avistamiento
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

      // Crear un archivo JSON con el avistamiento actualizado
      const avistamientoData = JSON.stringify(avistamientoEditado);
      const blob = new Blob([avistamientoData], { type: 'application/json' });

      // Referencia al archivo del avistamiento en Firebase Storage
      const nombreArchivo = `users/${uid}/avistamientos/${avistamientoId}_avistamiento.json`;
      const storageRef = this.aveStorage.ref(nombreArchivo);

      // Subir el archivo JSON actualizado a Firebase Storage
      const task = this.aveStorage.upload(nombreArchivo, blob);
      await firstValueFrom(task.snapshotChanges());

      console.log(`Avistamiento ${avistamientoId} editado correctamente.`);
      this.emitirRecarga(); // Emitir evento de recarga después de editar
    } catch (error) {
      console.error('Error al editar el avistamiento:', error);
      throw error;
    }
  }

  /**
   * Obtener un avistamiento por su ID desde Firebase Storage
   * @param avistamientoId - El ID del avistamiento que se desea obtener
   * @param uid - El UID del usuario autenticado
   * @returns Una promesa que resuelve con el avistamiento obtenido
   */
  async obtenerAvistamiento(uid: string, avistamientoId: string): Promise<Avistamiento> {
    try {
      if (!uid) {
        throw new Error('UID de usuario no proporcionado');
      }

      if (!avistamientoId) {
        throw new Error('ID de avistamiento no proporcionado');
      }

      // Crear la referencia al archivo JSON del avistamiento en Firebase Storage
      const ref = this.aveStorage.ref(`users/${uid}/avistamientos/${avistamientoId}_avistamiento.json`);
      
      // Obtener la URL de descarga del archivo JSON
      const avistamientoURL = await firstValueFrom(ref.getDownloadURL());

      // Hacer una petición HTTP para obtener los datos del avistamiento desde la URL
      const response = await fetch(avistamientoURL);
      if (!response.ok) {
        throw new Error(`Error al obtener avistamiento: ${response.statusText}`);
      }

      // Convertir la respuesta en JSON y devolverla como objeto Avistamiento
      const avistamientoData = await response.json();
      return avistamientoData as Avistamiento;

    } catch (error) {
      console.error('Error al obtener el avistamiento:', error);
      throw error;
    }
  }

  // Método para emitir el evento de recarga
  emitirRecarga() {
    this.avistamientosRecargarSubject.next(); // Emite un valor para notificar a los suscriptores
  }
}





