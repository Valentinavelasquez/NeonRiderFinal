import { Component, inject } from '@angular/core';
import { Product } from '../../services/product/product';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
imports: [RouterLink, ActivatedRoute, Router],
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Producto } from '../../services/product/product';
import { CartService } from '../../services/cart/cart';

@Component({
  selector: 'app-cascos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cascos.html',
  styleUrls: ['./cascos.css']
})
export default class Cascos implements OnInit {
  private product = inject(ProductService);
  private cart = inject(CartService);

  productService = inject(Product)
  items!:any
constructor(private router: ActivatedRoute) {}

  ngOnInit() {

    this.renderCascos(this.router.snapshot.params['categoria'])
  }

  renderCascos(categoria: string) {
  this.productService.getCascos().subscribe({
    next: (dataApi: any) => {
      if (categoria === 'todos') {
        this.items = dataApi; // muestra todo
      } else {
        this.items = dataApi.filter((casco: any) => casco.categoria === categoria);
      }
    },
    error: (error: any) => {
      console.error(error);
    }
  });
}


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
