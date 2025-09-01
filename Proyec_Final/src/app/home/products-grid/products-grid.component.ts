import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { CartService, Product } from '../../shared/cart.service';

@Component({
  selector: 'app-products-grid',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './products-grid.component.html',
  styleUrls: ['./products-grid.component.css']
})
export class ProductsGridComponent {
  constructor(private cart: CartService) {}

  products: Product[] = [
    { name: 'Casco Rick And Morty', priceLabel: '$450.000', thumb: 'assets/img/Caco_Rick_And_Morty.png' },
    { name: 'Casco Japonés',        priceLabel: '$480.000', thumb: 'assets/img/Casco_Japones.png' },
    { name: 'Casco Red Bull',       priceLabel: '$520.000', thumb: 'assets/img/Casco_red_bull.png' },
    { name: 'Cobra Negra',          priceLabel: '$500.000', thumb: 'assets/img/cobra_negra.png' },
    { name: 'Dragón Kawasaki',      priceLabel: '$550.000', thumb: 'assets/img/Dragon_Kawasaki.png' }
  ];

  add(p: Product) { this.cart.add(p); }
}
