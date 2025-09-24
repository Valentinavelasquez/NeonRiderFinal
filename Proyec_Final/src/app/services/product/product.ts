import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Product {



  private apiUrl:String ="http://localhost:3000/api"
  constructor(private http : HttpClient){}


  createProduct(body:any) {
    return this.http.post(`${this.apiUrl}/product`, body)
  }

  getCascos() {
    return this.http.get(`${this.apiUrl}/products`)
  }

  deleteProduct (id:string) {
    return this.http.delete(`${this.apiUrl}/product/${id}`)
  }

  editarProduct (body: any, id:string) {
    return this.http.put(`${this.apiUrl}/product/${id}`, body)
  }

  getOneProduct(id:string) {
    return this.http.get(`${this.apiUrl}/product/${id}`)
  }

}
