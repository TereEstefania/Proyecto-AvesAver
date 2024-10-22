import { Component, OnInit } from '@angular/core';
import { EbirdService } from '../services/ebird.service';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  provincias: any[] = []; // Lista de provincias
  provFiltradas: any[] = []; // Provincias filtradas
  busqueda: string = ''; // Término de búsqueda
  avistamientos: any[] = []; // Lista de avistamientos recientes
  mostrarListaProv: boolean = false; // Para mostrar/ocultar la lista de provincias

  constructor(private ebirdService: EbirdService) {}

  ngOnInit() {
    this.cargarProvincias();
  }

  // Método para cargar las provincias
  cargarProvincias() {
    this.ebirdService.getProvArg().subscribe(
      (response) => {
        this.provincias = response; // Almacena la respuesta en el arreglo de provincias
        this.provFiltradas = response; // Inicializa las provincias filtradas
        this.mostrarListaProv = true; // Muestra la lista
      },
      (error) => {
        console.error('Error al cargar las provincias:', error);
      }
    );
  }

  // Método para cargar avistamientos recientes de una provincia seleccionada
  getAvistamientoProv(provinceCode: string) {
    this.ebirdService.getAvistRecientes(provinceCode).subscribe(
      (data) => {
        this.avistamientos = data; // Almacena los avistamientos recientes
        this.mostrarListaProv = false; // Oculta la lista de provincias después de seleccionar
      },
      (error) => {
        console.error('Error fetching observations:', error);
      }
    );
  }

  // Método para extraer solo el nombre de la ubicación
  ubicacionNombre(locName: string): string {
    // Dividir la cadena por el paréntesis y tomar la primera parte
    return locName.split('(')[0].trim();
  }

  // Método para filtrar las provincias según el término de búsqueda
  filtrarProvincias() {
    this.provFiltradas = this.provincias.filter(provincia =>
      provincia.name.toLowerCase().includes(this.busqueda.toLowerCase())
    );
    this.mostrarListaProv = this.provFiltradas.length > 0; // Muestra la lista si hay provincias filtradas

    if (this.busqueda.length > 0) {
      this.avistamientos = []; // Limpiar los avistamientos cuando el usuario empieza a buscar de nuevo
    }
  }

  // Método para manejar la selección de una provincia
  seleccionarProvincia(provinceCode: string) {
    this.getAvistamientoProv(provinceCode);
    this.busqueda = ''; // Limpiar el término de búsqueda
  }
}
