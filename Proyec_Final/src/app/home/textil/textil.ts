import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart/cart';

@Component({
  selector: 'app-textil',
  standalone: true,
  imports: [],
  templateUrl: './textil.html',
  styleUrl: './textil.css'
})
export class Textil {
  private cart = inject(CartService);

  // Producto demo para el botón
  productoDemo = {
    referencia: 'Chaqueta Touring',
    Descripcion: 'Impermeable, protecciones CE, gran ventilación.',
    Precio: 310000,
    Imagen: 'Cascos/integral_2.jpg',
    _id: 'textil-1'
  };

  addToCart() {
    this.cart.add(this.productoDemo, 1);
  }
}
