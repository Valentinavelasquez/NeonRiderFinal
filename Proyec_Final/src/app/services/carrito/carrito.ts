import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../config/env';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  crear(body: any) {
    return this.http.post(`${this.apiUrl}/createCarrito`, body);
  }
}
