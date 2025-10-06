import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

@Injectable({  providedIn: 'root'})
export class Accesorios {
  private apiUrl: string = 'https://d3ialmb2cy79c5.cloudfront.net/NeonRider/api';
  constructor(private http: HttpClient) {}

  createAccesorio(body: any) {
      return this.http.post(`${this.apiUrl}/accesorio`, body);
    }

    getAccesorio(): Observable<Producto[]> {
      return this.http
        .get<Producto[] | { data: Producto[] }>(`${this.apiUrl}/accesorios`)
        .pipe(map(res => (Array.isArray(res) ? res : (res as any)?.data ?? [])));
    }

    deleteAccesorio(id: string) {
      return this.http.delete(`${this.apiUrl}/accesorio/${id}`);
    }

    editarAccesorio(body: any, id: string) {
      return this.http.put(`${this.apiUrl}/accesorio/${id}`, body);
    }

    getOneAccesorio(id: string): Observable<Producto> {
      return this.http
        .get<Producto | { data: Producto }>(`${this.apiUrl}/accesorio/${id}`)
        .pipe(map(res => (Array.isArray(res) ? (res as any)[0] : (res as any)?.data ?? (res as Producto))));
    }
}
