import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NuevaListaPage } from './nueva-lista.page'; // Importa el modal

@Component({
  selector: 'app-listas',
  templateUrl: './listas.page.html',
  styleUrls: ['./listas.page.scss'],
})
export class ListasPage {

  constructor(private modalController: ModalController) {}

  async abrirModalNuevaLista() {
    const modal = await this.modalController.create({
      component: NuevaListaPage
    });
    return await modal.present();
  }
}
