import { Routes } from '@angular/router';

import Dashboard from './home/dashboard/dashboard';
import Cascos    from './home/cascos/cascos';
import { Accesorios } from './home/accesorios/accesorios';
import { Textil } from './home/textil/textil';
import { CascosIntegrales } from './home/cascos-integrales/cascos-integrales';
import { CascosAbatibles } from './home/cascos-abatibles/cascos-abatibles';
import { CascosAbiertos } from './home/cascos-abiertos/cascos-abiertos';
import { CascosCross } from './home/cascos-cross/cascos-cross';
import { CascosModulares } from './home/cascos-modulares/cascos-modulares';
import { CascosMultiproposito } from './home/cascos-multiproposito/cascos-multiproposito';
import { Visualizacion } from './home/visualizacion/visualizacion';
import { SobreNosotros } from './home/sobre-nosotros/sobre-nosotros';
import { Administrador} from './private/administrador/administrador';
import { Registro } from './public/registro/registro';
import { Carrusel } from './home/carrusel/carrusel';
import { Loguin } from './public/loguin/loguin';

export const routes: Routes = [
  {path:"", redirectTo:"dashboard", pathMatch: "full"},
  {path:"loguin", component:Loguin, pathMatch: "full"},
  {path:"carrusel", component:Carrusel},
  {path:"dashboard", component:Dashboard},
  {path:"registro", component:Registro},
  {path:"administrador", component:Administrador},
  {path:"accesorios", component:Accesorios},
  {path:"cascos/:categoria", component:Cascos},
  {path:"textil", component:Textil},
  {path:"cascosintegrales", component:CascosIntegrales},
  {path:"cascosabatibles", component:CascosAbatibles},
  {path:"cascosabiertos", component:CascosAbiertos},
  {path:"cascoscross", component:CascosCross},
  {path:"cascosmodulares", component:CascosModulares},
  {path:"cascosmultiproposito", component:CascosMultiproposito},
  {path:"visualizaciones/:id", component:Visualizacion},
  {path:"sobre-nosotros", component:SobreNosotros},
  { path: "**", redirectTo: "error-404", pathMatch: "full"}
];
