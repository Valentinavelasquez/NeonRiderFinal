import { Component, signal } from '@angular/core';
import { IonicModule, MenuController } from '@ionic/angular';
import { RouterOutlet } from '@angular/router';
import { CartModalComponent } from './shared/cart-modal/cart-modal.component';
import { CartService } from './shared/cart.service';   // ⬅️ importa el servicio

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonicModule, RouterOutlet, CartModalComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('Proyec_Final');

  constructor(
    private menu: MenuController,
    private cart: CartService            // ⬅️ inyecta el servicio
  ) {}

  abrirCarrito() {
    this.menu.open('carritoMenu');       // (opcional) tu sidebar ionic
  }

  // ⬅️ NUEVO: abre el modal lateral Angular
  abrirModalCarrito() {
    this.cart.open();
  }
}
