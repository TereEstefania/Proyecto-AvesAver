import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ListasService } from '../services/listas.service';

@Component({
  selector: 'app-nueva-lista',
  templateUrl: './nueva-lista.page.html',
  styleUrls: ['./nueva-lista.page.scss'],
})
export class NuevaListaPage {
  nombreLista: string = '';

  constructor(
    private modalController: ModalController,
    private listasService: ListasService    
  ) {}

  cerrarModal() {
    this.modalController.dismiss();
  }

  async guardarLista() {
    try {
      // Validar que el nombre de la lista esté completo
      if (!this.nombreLista) {
        console.error('El nombre de la lista es obligatorio.');
        // Aquí puedes llamar a una función para mostrar un mensaje de error si es necesario
        return;
      }
  
      // Crear un nuevo objeto lista
      const nuevaLista = {
        nombre: this.nombreLista,
        fechaCreacion: new Date(), // O cualquier otra información relevante
        elementos: [] // Inicializa como un arreglo vacío
      };
  
      // Guardar la nueva lista en Firestore
      const exito = await this.listasService.guardarLista(nuevaLista);
      if (exito) {
        console.log('Lista guardada exitosamente');
      }
  
      // Cerrar el modal
      this.cerrarModal();
    } catch (error) {
      console.error('Error al guardar la lista:', error);
    }
  }
  
  
}
