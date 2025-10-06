import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { CartService } from '../../services/cart/cart';

@Component({
  selector: 'app-nabvar',
  standalone: true,
  imports: [RouterLink, AsyncPipe,],
  templateUrl: './nabvar.html',
  styleUrl: './nabvar.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class Nabvar{
menuAbierto = false;
loguiado:boolean =!!sessionStorage.getItem('token');
  private cart = inject(CartService);
  count$ = this.cart.count$;

toggleMenu() {
  this.menuAbierto = !this.menuAbierto;
}
  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  }

  ngOnInit() { this.loguiado = !!sessionStorage.getItem('token'); }
  ngDoCheck() { this.loguiado = !!sessionStorage.getItem('token'); }

  openCart() { this.cart.open(); }
}
