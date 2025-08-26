import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from "./home/footer/footer";
import { Nabvar } from "./home/nabvar/nabvar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Nabvar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Proyec_Final');
}
