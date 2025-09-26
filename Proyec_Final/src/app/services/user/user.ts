import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class User {
  private apiUrl: string = 'https://d3ialmb2cy79c5.cloudfront.net/NeonRider/api';
  constructor(private http: HttpClient) {}

  register(body: any) {
    return this.http.post(`${this.apiUrl}/createUser`, body);
  }

  login(body: any) {
    return this.http.post(`${this.apiUrl}/login`, body);
  }
}
