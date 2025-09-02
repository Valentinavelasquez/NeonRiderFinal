import { Routes } from '@angular/router';
import { Loguin } from './public/loguin/loguin';
import { Dashboard } from './home/dashboard/dashboard'; // si aún lo usas en otra ruta
import { Registro } from './public/registro/registro';
import { Carrusel } from './home/carrusel/carrusel';    // solo si lo navegas como página aparte
import { CarritoComponent } from './home/carrito/carrito.component';
import { ProductsGridComponent } from './home/products-grid/products-grid.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // El dashboard muestra Navbar + Carrusel + Grid + Footer
  { path: 'dashboard', component: ProductsGridComponent },

  // Otras rutas que quieras mantener
  { path: 'loguin', component: Loguin },
  { path: 'registro', component: Registro },
  { path: 'carrito', component: CarritoComponent },

  // (Opcional) si tienes una página Dashboard distinta:
  // { path: 'home', component: Dashboard },

  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];
