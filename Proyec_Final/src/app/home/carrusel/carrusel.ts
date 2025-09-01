import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './carrusel.html',
  styleUrls: ['./carrusel.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Carrusel {
  @ViewChild('slider', { static: true }) sliderRef!: ElementRef<HTMLUListElement>;

  activate(action: string) {
    const slider = this.sliderRef.nativeElement;
    const items = slider.querySelectorAll('.item');

    if (action === 'next' && items.length > 0) {
      slider.appendChild(items[0]); // mueve el primero al final
    }
    if (action === 'prev' && items.length > 0) {
      slider.prepend(items[items.length - 1]); // mueve el último al inicio
    }
  }
}
