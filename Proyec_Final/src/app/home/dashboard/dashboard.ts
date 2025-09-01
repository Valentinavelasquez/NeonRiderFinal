import { Component } from '@angular/core';
import { Carrusel } from "../carrusel/carrusel";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [Carrusel,RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

}
