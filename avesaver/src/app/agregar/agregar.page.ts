import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage implements OnInit {

  fechaSeleccionada: string | null = null;
  mostrarCalendario = false;

  constructor() {}

  elegirFecha(event: any) {
    this.fechaSeleccionada = event.detail.value;
    this.mostrarCalendario = false; // Cierra el modal cuando selecciona la fecha
  }

  // Abre el calendario (ion-datetime dentro del ion-modal)
  abrirCalendario() {
    this.mostrarCalendario = true;
  }

  // Cierra el calendario sin seleccionar
  cerrarCalendario() {
    this.mostrarCalendario = false;
  }

  ngOnInit() {
  }

}
