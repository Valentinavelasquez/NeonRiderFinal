import { Component, inject } from '@angular/core';
import { Product } from '../../services/product/product';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cascos',
  imports: [RouterLink],
  templateUrl: './cascos.html',
  styleUrl: './cascos.css'
})
export class Cascos {

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


}
