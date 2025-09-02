import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

// 👇 importa tus componentes de cabecera y pie (standalone)
import { Navbar } from './home/navbar/navbar';
import { Footer } from './home/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, Navbar, Footer],
  template: `
    <ion-app>
      <app-navbar></app-navbar>

      <ion-router-outlet></ion-router-outlet>

      <app-footer></app-footer>
    </ion-app>
  `,
})
export class App {}
