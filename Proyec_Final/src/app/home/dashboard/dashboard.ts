import { Component } from '@angular/core';
import { Carrusel } from '../carrusel/carrusel';
import { ProductsGridComponent } from '../products-grid/products-grid.component';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    IonContent,
    Carrusel,
    ProductsGridComponent
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {}
