import { Component, inject } from '@angular/core';
import { Cascos } from '../cascos/cascos';
import { Product } from '../../services/product/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-visualizacion',
  imports: [],
  templateUrl: './visualizacion.html',
  styleUrl: './visualizacion.css'
})
export class Visualizacion {

    productService = inject(Product)
    items!:any

    constructor(private router:ActivatedRoute){}
    ngOnInit() {
       this.router.snapshot.params['id']
       this.renderCasco( this.router.snapshot.params['id'])
    }

    renderCasco(id:any){
        this.productService.getOneProduct(id).subscribe({
            next:(dataApi:any)=>{
                this.items=dataApi
            },
            error:(error:any)=>{
                console.log(error);
            }
        })
    }
}
