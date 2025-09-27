import { Component, inject } from '@angular/core';
import { Carrusel } from "../carrusel/carrusel";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../services/product/product';

@Component({
  selector: 'app-dashboard',
  imports: [Carrusel,RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
    items!: any

    productService = inject(Product)




ngOnInit() {
this.renderProduct()
}

renderProduct() {
    this.productService.getCascos().subscribe({
        next:(dataApi:any)=> {
            this.items = dataApi
        },
        error:(error:any)=> {
            console.log(error);

        }
    })
  }
}
