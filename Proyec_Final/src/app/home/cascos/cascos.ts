import { Component, inject } from '@angular/core';
import { Product } from '../../services/product/product';

@Component({
  selector: 'app-cascos',
  imports: [],
  templateUrl: './cascos.html',
  styleUrl: './cascos.css'
})
export class Cascos {

  productService = inject(Product)
  items!:any
  ngOnInit() {
    this.renderCascos()
  }

  renderCascos() {
    this.productService.getCascos().subscribe({
      next:(dataApi:any)=> {
        this.items= dataApi
      },
      error:(error:any)=> {
        console.log(error);

      }
    })
  }




}
