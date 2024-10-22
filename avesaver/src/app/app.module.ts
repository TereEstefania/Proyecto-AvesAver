import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment'; 

// FIREBASE AUTENTICACION
import { AngularFireModule } from '@angular/fire/compat'; 
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

// FIREBASE ALMACENAMIENTO
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AuthInterceptor } from './services/http-interceptors.service';  // Importa tu interceptor

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule, 
    AngularFireStorageModule, 
    HttpClientModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(
      withInterceptorsFromDi()  // Configura interceptores desde el inyector de dependencias
    )
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
