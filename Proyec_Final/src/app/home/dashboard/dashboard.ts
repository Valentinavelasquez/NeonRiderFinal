import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Producto } from '../../services/product/product';
import { Carrusel } from '../carrusel/carrusel';
import { CartService } from '../../services/cart/cart';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../services/product/product';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink ,Carrusel],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export default class Dashboard implements OnInit {
  private productService = inject(ProductService);
  private cart = inject(CartService);

  loading = true;
  lista: Producto[] = [];
  items: Producto[] = []; // usado en el HTML

  ngOnInit(): void {
    this.productService.getCascos().subscribe({
      next: (rows) => {
        this.lista = (rows ?? []) as Producto[];
        this.items = this.lista;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  // llamado desde el template del dashboard
  addToCart(p: Producto): void {
    this.cart.add(p, 1);
  }
}
