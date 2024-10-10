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


/**
 * @function elegirFecha
 * @param event tipo any, contiene el valor de la fecha seleccionada por el usuario
 * @description esta función maneja la selección de una fecha en el calendario.
 */
  elegirFecha(event: any) {
    this.fechaSeleccionada = event.detail.value;
    this.mostrarCalendario = false; 
  }

/**
 * @function abrirCalendario
 * @description esta funcion muestra el calendario cuando se presiona el input fecha.
 */
  abrirCalendario() {
    this.mostrarCalendario = true;
  }

/**
 * @function cerrarCalendario
 * @description esta función permite el cierre del calendario cuando el usuario selecciona una fecha o cuando presiona la pantalla por fuera del calendario
 */
  cerrarCalendario() {
    this.mostrarCalendario = false;
  }

  ngOnInit() {
  }

}
