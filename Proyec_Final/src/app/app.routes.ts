import { Routes } from '@angular/router';
import { Loguin } from './public/loguin/loguin';
import { Dashboard } from './home/dashboard/dashboard';
import { Registro } from './public/registro/registro';
import { Carrusel } from './home/carrusel/carrusel';

export const routes: Routes = [
  {path:"loguin", component:Loguin},
  {path:"dashboard", component:Dashboard},
  {path:"carrusel", component:Carrusel},
  {path:"registro", component:Registro}
];

