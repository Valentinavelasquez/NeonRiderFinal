import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import Swal from 'sweetalert2';

// ⚠ OJO: este es el CartService de UI (state), en /services/cart/cart.ts
import { CartService } from '../../services/cart/cart';
// Opcional: si luego quieres crear pedido en backend
import { CarritoService } from '../../services/carrito/carrito';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './cart-drawer.html',
  styleUrls: ['./cart-drawer.css'],
})
export class CartDrawer {
  private cart = inject(CartService);
  private pedidos = inject(CarritoService);

  // Exponemos Observables al template
  isOpen$ = this.cart.isOpen$;
  items$  = this.cart.items$;
  total$  = this.cart.total$;

  // Acciones
  close()   { this.cart.close(); }
  clear()   { this.cart.clear(); }
  remove(id: string) { this.cart.remove(id); }

  // Demo de checkout
  checkout() {
    // Aquí podrías enviar al backend con this.pedidos.crear(...)
    Swal.fire({ title: '¡Pedido listo!', text: 'Pronto agregamos el checkout real.', icon: 'success' });
    this.cart.close();
  }

  // Formateo local sin CurrencyPipe
  formatCOP(v: number | null | undefined): string {
    const n = Number(v || 0);
    return '$' + new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(n);
  }
}
