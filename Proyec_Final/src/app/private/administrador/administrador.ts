import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Product } from '../../services/product/product';
import Swal from 'sweetalert2';
import { Accesorios } from '../../services/accesorios/accesorios';

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
  accesorioService = inject(Accesorios)

    items!: any
  formProduct !: FormGroup
  formAccesorio !: FormGroup
  idProduct!: string

  constructor(private fb: FormBuilder) {
    this.formProduct = fb.group({
      Imagen:"",
      Descripcion:"",
      referencia:"",
      Marca: "",
      Tipo:"",
      Color: "Azul",
      Precio:""
    }),
    this.formAccesorio = fb.group({
        Imagen:"",
        Descripcion:"",
        referencia:"",
        Marca: "",
        Talla:"",
        Color: "Azul",
        Precio:""
    })
  }

  ngOnInit() {
    this.renderProduct()
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
              this.renderProduct()
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

  deleteProduct(id:string) {
    this.productService.deleteProduct(id).subscribe({
        next:(dataApi:any)=>{
            this.renderProduct()
        },
        error:(error:any)=> {
        }
    })
  }

  updateProduct(id:string) {
    this.productService.getOneProduct(id).subscribe({
        next:(dataApi:any)=>{
            this.formProduct.patchValue({
                Imagen:dataApi.Imagen,
                Descripcion:dataApi.Descripcion,
                referencia:dataApi.referencia,
                Marca:dataApi.Marca,
                Tipo:dataApi.Tipo,
                Color:dataApi.Color,
                Precio:dataApi.Precio
            })
            this.idProduct = id
        },
        error:(error:any)=>{
            console.log(error);
        }
    })

  }
  updateFinal(){
        this.productService.editarProduct(this.formProduct.value,this.idProduct).subscribe({
            next:(dataApi:any)=>{
                this.renderProduct()
                this.idProduct = ""
            },
            error:(error:any)=>{
                console.log(error);

            }
        })
  }

  //----

  createAccesorio() {
    console.log(this.formAccesorio.value);
    this.accesorioService.createAccesorio(this.formProduct.value).subscribe({
      next:(dataApi: any)=> {
              Swal.fire({
                title:"¡Creado!",
                icon:"success",
                text:"Accesorio Creado!",
                draggable:true
              })
              this.renderAccesorio()
              this.formAccesorio.reset()
      },
      error:(error:any)=> {
              Swal.fire({
                title:"¡Error!",
                icon:"warning",
                text:"El Accesorio no se pudo crear!",
                draggable:true
              })
      }
    })
  }

  renderAccesorio() {
    this.accesorioService.getAccesorio().subscribe({
        next:(dataApi:any)=> {
            this.items = dataApi
        },
        error:(error:any)=> {
            console.log(error);

        }
    })
  }

  deleteAccesorio(id:string) {
    this.accesorioService.deleteAccesorio(id).subscribe({
        next:(dataApi:any)=>{
            this.renderAccesorio()
        },
        error:(error:any)=> {
        }
    })
  }

  updateAccesorio(id:string) {
    this.accesorioService.getOneAccesorio(id).subscribe({
        next:(dataApi:any)=>{
            this.formAccesorio.patchValue({
                Imagen:dataApi.Imagen,
                Descripcion:dataApi.Descripcion,
                referencia:dataApi.referencia,
                Marca:dataApi.Marca,
                Talla:dataApi.Talla,
                Color:dataApi.Color,
                Precio:dataApi.Precio
            })
            this.idProduct = id
        },
        error:(error:any)=>{
            console.log(error);
        }
    })

  }
}
