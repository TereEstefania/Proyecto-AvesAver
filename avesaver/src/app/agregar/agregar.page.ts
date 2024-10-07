import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage implements OnInit {

  selectedDate: string | undefined;  // Variable para almacenar la fecha seleccionada

  constructor() {}

  // Función que guarda la fecha seleccionada
  guardarFecha(event: any) {
    const fechaSeleccionada = event.detail.value;  // Obtén el valor seleccionado
    console.log('Fecha seleccionada:', fechaSeleccionada);
    // Aquí puedes agregar la lógica para guardar la fecha, por ejemplo, enviarla a una base de datos
  }
  ngOnInit() {
  }

}
