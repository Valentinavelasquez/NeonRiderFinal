import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Carrito } from '../../models/carrito/carrito.model';


@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getCarritos(): Observable<Carrito[]> {
    return this.http.get<Carrito[]>(`${this.apiUrl}/carritos`);
  }

  getCarrito(id: string): Observable<Carrito> {
    return this.http.get<Carrito>(`${this.apiUrl}/carrito/${id}`);
  }

  createCarrito(carrito: Carrito): Observable<Carrito> {
    return this.http.post<Carrito>(`${this.apiUrl}/createCarrito`, carrito);
  }

  updateCarrito(id: string, carrito: Carrito): Observable<Carrito> {
    return this.http.put<Carrito>(`${this.apiUrl}/updateCarrito/${id}`, carrito);
  }

  deleteCarrito(id: string): Observable<{ msg: string }> {
    return this.http.delete<{ msg: string }>(`${this.apiUrl}/deleteCarrito/${id}`);
  }
}
