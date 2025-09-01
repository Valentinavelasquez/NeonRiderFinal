// src/app/home/navbar/navbar.ts
import { Component } from '@angular/core';
import { IonicModule, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  constructor(private menu: MenuController) {}

  openCarrito() {
    this.menu.open('carritoMenu'); // abre el sidebar del carrito
  }
}
