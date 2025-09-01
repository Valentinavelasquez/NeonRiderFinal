import { Routes } from '@angular/router';
import { Footer } from './home/footer/footer';
import { Nabvar } from './home/nabvar/nabvar';
import { Loguin } from './public/loguin/loguin';
import { Dashboard } from './home/dashboard/dashboard';
import { Registro } from './public/registro/registro';
import { Carrusel } from './home/carrusel/carrusel';
import { Component } from '@angular/core';
import { Administrador } from './private/administrador/administrador';
import { RouterLink } from '@angular/router';
import { Accesorios } from './home/accesorios/accesorios';
import { Cascos } from './home/cascos/cascos';
import { Textil } from './home/textil/textil';
export const routes: Routes = [
  {path:"", redirectTo:"dashboard", pathMatch: "full"},
  {path:"loguin", component:Loguin, pathMatch: "full"},
  {path:"carrusel", component:Carrusel},
  {path:"dashboard", component:Dashboard},
  {path:"registro", component:Registro},
  {path:"administrador", component:Administrador},
  {path:"accesorios", component:Accesorios},
  {path:"cascos", component:Cascos},
  {path:"textil", component:Textil},
  { path: "**", redirectTo: "error-404", pathMatch: "full"}
];


