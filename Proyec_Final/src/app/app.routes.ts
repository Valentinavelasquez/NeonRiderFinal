import { Routes } from '@angular/router';
import { Footer } from './home/footer/footer';
import { Nabvar } from './home/nabvar/nabvar';
import { Loguin } from './public/loguin/loguin';
import { Dashboard } from './home/dashboard/dashboard';
import { Registro } from './public/registro/registro';
import { Carrusel } from './home/carrusel/carrusel';

export const routes: Routes = [
  {path:"loguin", component:Loguin},
  {path:"carrusel", component:Carrusel},
  {path:"dashboard", component:Dashboard},
  {path:"registro", component:Registro}
];

