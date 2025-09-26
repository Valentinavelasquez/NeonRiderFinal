import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Producto {
  _id?: string;
  id?: string;
  referencia?: string;
  nombre?: string;
  Descripcion2?: string;
  descripcion?: string;
  Imagen?: string;
  img?: string;
  Precio?: number;
  precio?: number;
  [k: string]: any;
}

@Injectable({ providedIn: 'root' })
export class Product {
  private apiUrl: string = 'https://d3ialmb2cy79c5.cloudfront.net/NeonRider/api';
  constructor(private http: HttpClient) {}

  createProduct(body: any) {
    return this.http.post(`${this.apiUrl}/product`, body);
  }

  getCascos(): Observable<Producto[]> {
    return this.http
      .get<Producto[] | { data: Producto[] }>(`${this.apiUrl}/products`)
      .pipe(map(res => (Array.isArray(res) ? res : (res as any)?.data ?? [])));
  }

  deleteProduct(id: string) {
    return this.http.delete(`${this.apiUrl}/product/${id}`);
  }

  editarProduct(body: any, id: string) {
    return this.http.put(`${this.apiUrl}/product/${id}`, body);
  }

  getOneProduct(id: string): Observable<Producto> {
    return this.http
      .get<Producto | { data: Producto }>(`${this.apiUrl}/product/${id}`)
      .pipe(map(res => (Array.isArray(res) ? (res as any)[0] : (res as any)?.data ?? (res as Producto))));
  }
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private product: Product) {}

  getCascos(): Observable<Producto[]> {
    return this.product.getCascos();
  }

  getOneProduct(id: string): Observable<Producto> {
    return this.product.getOneProduct(id);
  }

  // Si más adelante se usa Admin:
  createProduct(body: any) { return this.product.createProduct(body); }
  editarProduct(body: any, id: string) { return this.product.editarProduct(body, id); }
  deleteProduct(id: string) { return this.product.deleteProduct(id); }
}
