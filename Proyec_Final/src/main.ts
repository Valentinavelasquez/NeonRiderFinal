import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

import { IonicModule } from '@ionic/angular';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(IonicModule.forRoot())
  ]
});
