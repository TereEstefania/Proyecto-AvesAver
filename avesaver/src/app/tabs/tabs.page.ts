import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    public auth: AuthenticationService,
    public router: Router
  ) {}

  logout() {
    this.auth.logOut()
    console.log('Sesión cerrada');
    this.router.navigate(['login'])
  }
}
