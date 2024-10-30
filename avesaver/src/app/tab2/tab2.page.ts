import { Component, OnInit } from '@angular/core';
import { EbirdService } from '../services/ebird.service';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  paises: any[] = [];
  provincias: any[] = [];
  provFiltradas: any[] = [];
  avistamientos: any[] = [];
  mostrarListaProv: boolean = false;
  paisSeleccionado: string = '';
  provinciaSeleccionada: string = '';

  constructor(private ebirdService: EbirdService) {}

  ngOnInit() {
    this.cargarPaises();
  }

  ionViewWillEnter() {
    this.paisSeleccionado = '';
    this.provinciaSeleccionada = '';
    this.provincias = [];
    this.provFiltradas = [];
    this.avistamientos = [];
  }

  /**
  * @function cargarPaises
  * @description esta función muestra la lista de paises al invocar la funcion getPaises del servicio ebirService
  */
  cargarPaises() {
    this.ebirdService.getPaises().subscribe(
      (response) => {
        this.paises = response;
      },
      (error) => {
        console.error('Error al cargar los países:', error);
      }
    );
  }

  /**
  * @function cargarProvincias
  * @param pais de tipo string corresponde al pais seleccionado de la lista de paises desplegada
  * @description esta función muestra la lista de provincias correspondiente a un pais especifico al invocar la funciíon getProvinciasPorPais del servicio ebirdService
  */
  cargarProvincias(pais: string) {
    this.ebirdService.getProvinciasPorPais(pais).subscribe(
      (response) => {
        this.provincias = response;
        this.provFiltradas = response;
        this.mostrarListaProv = true;
      },
      (error) => {
        console.error('Error al cargar las provincias:', error);
      }
    );
  }

  /**
  * @function getAvistamientoProv
  * @param codProvincia de tipo string corresponde al codigo de la provincia seleccionada
  * @description esta función permite obtener una lista de los avistamientos registrados en la provincia elegida
  */
  getAvistamientoProv(codProvincia: string) {
    this.ebirdService.getAvistRecientes(codProvincia).subscribe(
      (data) => {
        this.avistamientos = data;
        this.mostrarListaProv = false;
      },
      (error) => {
        console.error('Error fetching observations:', error);
      }
    );
  }

  /**
  * @function ubicacionNombre
  * @param locNombre de tipo string corresponde al nombre de la ubicacion seleccionada
  * @returns esta función permite cortar lo que se obtiene al obtener una localización, así solo se extrae el nombre
  */
  ubicacionNombre(locNombre: string): string {
    return locNombre.split('(')[0].trim();
  }


  /**
  * @function seleccionarPais
  * @param pais de tipo string, corresponde al pais seleccionado
  * @description esta función permite 
  */
  seleccionarPais(pais: string) {
    this.paisSeleccionado = pais;
    this.cargarProvincias(pais);
  }

  /**
  * @function seleccionarProvincia
  * @param codProvincia de tipo string, corresponde al codigo de la provincia seleccionada
  * @description esta función permite obtener una lista de los avistamientos de la provincia seleccionada
  */
  seleccionarProvincia(codProvincia: string) {
    this.getAvistamientoProv(codProvincia);
  }
}


