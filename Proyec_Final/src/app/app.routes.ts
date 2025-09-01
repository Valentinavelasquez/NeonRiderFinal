// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { Loguin } from './public/loguin/loguin';
import { Dashboard } from './home/dashboard/dashboard';
import { Registro } from './public/registro/registro';
import { Carrusel } from './home/carrusel/carrusel';
import { CarritoComponent } from './home/carrito/carrito.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'loguin', component: Loguin },
  { path: 'dashboard', component: Dashboard },
  { path: 'carrusel', component: Carrusel },
  { path: 'registro', component: Registro },
  { path: 'carrito', component: CarritoComponent },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
];
