import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonList, IonItem, IonLabel, IonFooter
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { CarritoService, CartItem } from '../../services/carrito/carrito.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonContent, IonList, IonItem, IonLabel, IonFooter
  ],
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.css'],
})
export class CartModalComponent {
  @Output() closeRequest = new EventEmitter<void>();

  private cart = inject(CarritoService);

  items$: Observable<CartItem[]> = this.cart.items$;
  total$ = this.cart.total$;

  close() { this.closeRequest.emit(); }

  remove(i: number) { this.cart.deleteCarrito(i).subscribe(); }
  clear() { this.cart.clear(); }
}
