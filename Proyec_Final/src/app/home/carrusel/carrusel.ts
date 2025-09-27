import {
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrusel.html',
  styleUrls: ['./carrusel.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Carrusel {
  @ViewChild('slider', { static: true }) sliderRef!: ElementRef<HTMLUListElement>;

  constructor(private renderer: Renderer2) {}

  /** Mueve primer/último <li> para simular next/prev */
  activate(dir: 'next' | 'prev'): void {
    const slider = this.sliderRef?.nativeElement;
    if (!slider) return;

    const items = slider.querySelectorAll<HTMLLIElement>('.item');
    if (!items.length) return;

    if (dir === 'next') {
      this.renderer.appendChild(slider, items[0]);
    } else {
      const last = items[items.length - 1];
      const first = slider.firstElementChild;
      if (first) this.renderer.insertBefore(slider, last, first);
      else this.renderer.appendChild(slider, last);
    }
  }
}
