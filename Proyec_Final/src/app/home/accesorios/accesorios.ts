import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart/cart';

@Component({
  selector: 'app-accesorios',
  standalone: true,
  templateUrl: './accesorios.html',
  styleUrls: ['./accesorios.css'],
})
export class Accesorios {
  private cart = inject(CartService);

  productos = [
    { id: 1, nombre: 'Casco Integral Azul', descripcion: 'Casco integral con visor ahumado, diseño deportivo.', precio: 250000, img: 'assets/Cascos/integral_2.jpg' },
    { id: 2, nombre: 'Guantes Racing', descripcion: 'Guantes de cuero con protecciones.', precio: 120000, img: 'assets/Accesorios/guantes_1.jpg' },
  ];

  addToCart(p: any) { this.cart.add(p, 1); }

  formatCOP(valor: number): string {
    return '$' + new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(valor);
  }
}
