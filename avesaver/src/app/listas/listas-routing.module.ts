import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListasPage } from './listas.page';

const routes: Routes = [
  {
    path: '',
    component: ListasPage,
    children: [
      {
        path: 'nueva-lista',
        loadChildren: () => import('./nueva-lista.module').then(m => m.NuevaListaPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListasPageRoutingModule {}
