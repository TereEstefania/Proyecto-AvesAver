import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service'; // Importa tu servicio

@Component({
  selector: 'app-photo',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
})
export class PhotoPage implements OnInit {

  public photoUrl: string | undefined;

  constructor(private photoService: PhotoService) { }

  ngOnInit() {
  }

  sacarFoto() {
    this.photoService.takePhoto();
  }

}
