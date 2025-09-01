import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Product } from '../../services/product/product';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-administrador',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './administrador.html',
  styleUrl: './administrador.css'
})
export class Administrador {

  productService = inject(Product)


  formProduct !: FormGroup

  constructor(private fb: FormBuilder) {
    this.formProduct = fb.group({
      Imagen:"",
      Descripcion:"",
      referencia:"",
      Marca: "",
      Tipo:"",
      Color: "Azul",
      Precio:""
    })
  }


  ngOnInit() {

  }

  createProduct() {
    console.log(this.formProduct.value);
    this.productService.createProduct(this.formProduct.value).subscribe({
      next:(dataApi: any)=> {
              Swal.fire({
                title:"¡Creado!",
                icon:"success",
                text:"Producto Creado!",
                draggable:true
              })

              this.formProduct.reset()
      },
      error:(error:any)=> {
              Swal.fire({
                title:"¡Error!",
                icon:"warning",
                text:"El Producto no se pudo crear!",
                draggable:true
              })
      }
    })


  }



}
