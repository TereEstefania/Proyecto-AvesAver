import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    public authAve: AuthenticationService,
    public router: Router,
    private menu: MenuController
  ) {}

/**
 * @function logOut
 * @description esta función utiliza el el servicio de autenticación para cerrar sesión cuando el usuario presiona el btn 'cerrar sesión' y se redirecciona a la página de login.
 */
  logout() {
    this.authAve.logOut().then(() => {
      console.log('Sesión cerrada');
      this.router.navigate(['login']);
      this.menu.close();
    });
  }

}
