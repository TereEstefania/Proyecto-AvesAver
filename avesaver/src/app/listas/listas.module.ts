import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ListasPage } from './listas.page';
import { ListasPageRoutingModule } from './listas-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListasPageRoutingModule
  ],
  declarations: [ListasPage] // Quita `NuevaListaPage` de aquí
})
export class ListasPageModule {}
