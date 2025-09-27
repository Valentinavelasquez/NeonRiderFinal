import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from "./home/footer/footer";
import { Nabvar } from "./home/nabvar/nabvar";
import { CartDrawer } from './shared/cart-drawer/cart-drawer';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Nabvar, CartDrawer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Proyec_Final');
}
