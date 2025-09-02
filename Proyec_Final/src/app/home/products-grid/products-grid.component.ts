import { Component, inject } from '@angular/core';
import {
  IonContent, IonGrid, IonRow, IonCol,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonButton, IonFab, IonFabButton, IonIcon, IonModal
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { CartModalComponent } from '../../shared/cart-modal/cart-modal.component';
import { CarritoService, Product } from '../../services/carrito/carrito.service';

// 👇 carrusel (standalone)
import { Carrusel } from '../carrusel/carrusel';

@Component({
  selector: 'app-products-grid',
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonButton, IonFab, IonFabButton, IonIcon, IonModal,
    CartModalComponent,
    Carrusel
  ],
  templateUrl: './products-grid.component.html',
  styleUrls: ['./products-grid.component.css']
})
export class ProductsGridComponent {
  cartOpen = false;
  private cart = inject(CarritoService);
  count$ = this.cart.count$;

  products: Product[] = [
    { name: 'Casco Rick And Morty', price: 450000, image: 'Casco_Rick_And_Morty.png' },
    { name: 'Casco Japonés',        price: 380000, image: 'Casco_Japones.png' },
    { name: 'Casco Red Bull',       price: 520000, image: 'Casco_red_bull.png' },
    { name: 'Cobra Negra',          price: 299000, image: 'cobra_negra.png' },
    { name: 'Dragon Kawasaki',      price: 610000, image: 'Dragon_Kawasaki.png' },
  ];

  addToCart(p: Product) { this.cart.add(p, 1); }
  openCart() { this.cartOpen = true; }
  closeCart() { this.cartOpen = false; }
}
