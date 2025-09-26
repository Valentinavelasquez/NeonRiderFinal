import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Producto } from '../../services/product/product';
import { CartService } from '../../services/cart/cart';

@Component({
  selector: 'app-cascos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cascos.html',
  styleUrls: ['./cascos.css']
})
export default class Cascos implements OnInit {
  private product = inject(ProductService);
  private cart = inject(CartService);

  loading = true;
  lista: Producto[] = [];

  ngOnInit(): void {
    this.product.getCascos().subscribe({
      next: (data) => {
        this.lista = Array.isArray(data) ? data : [];
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  addToCart(p: Producto) {
    this.cart.add(p, 1);
  }

  formatCOP(v: number | undefined | null) {
    const n = Number(v ?? 0);
    return n.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
  }
}
