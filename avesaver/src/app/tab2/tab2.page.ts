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
  busqueda: string = '';
  avistamientos: any[] = [];
  mostrarListaProv: boolean = false;
  paisSeleccionado: string = '';
  provinciaSeleccionada: string = '';

  constructor(private ebirdService: EbirdService) {}

  ngOnInit() {
    this.cargarPaises();
  }

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

  getAvistamientoProv(provinceCode: string) {
    this.ebirdService.getAvistRecientes(provinceCode).subscribe(
      (data) => {
        this.avistamientos = data;
        this.mostrarListaProv = false;
      },
      (error) => {
        console.error('Error fetching observations:', error);
      }
    );
  }

  ubicacionNombre(locName: string): string {
    return locName.split('(')[0].trim(); // Método para extraer solo el nombre
  }

  filtrarProvincias() {
    this.provFiltradas = this.provincias.filter(provincia => {
      const coincideConBusqueda = provincia.name.toLowerCase().includes(this.busqueda.toLowerCase());
      return coincideConBusqueda;
    });
    this.mostrarListaProv = this.provFiltradas.length > 0;

    if (this.busqueda.length > 0) {
      this.avistamientos = [];
    }
  }

  seleccionarPais(pais: string) {
    this.paisSeleccionado = pais;
    this.cargarProvincias(pais);
  }

  seleccionarProvincia(provinceCode: string) {
    this.getAvistamientoProv(provinceCode);
    this.busqueda = '';
  }
}


