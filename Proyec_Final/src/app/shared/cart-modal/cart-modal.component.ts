import { Component } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.css']
})
export class CartModalComponent {
  constructor(public cart: CartService) {}
  close() { this.cart.close(); }

  get subtotalLabel() { return `$${this.cart.subtotal.toFixed(2)}`; }
  get totalLabel() { return `$${this.cart.subtotal.toFixed(2)}`; }
}
