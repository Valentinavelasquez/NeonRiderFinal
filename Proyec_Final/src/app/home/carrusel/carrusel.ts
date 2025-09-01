import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [CommonModule, IonIcon],
  templateUrl: './carrusel.html',
  styleUrls: ['./carrusel.css']
})
export class Carrusel implements AfterViewInit {
  @ViewChild('slider', { static: true }) sliderRef!: ElementRef<HTMLUListElement>;

  ngAfterViewInit(): void {}

  activate(dir: 'prev' | 'next') {
    const slider = this.sliderRef.nativeElement;
    const items = Array.from(slider.querySelectorAll('.item'));
    if (items.length < 2) return;

    if (dir === 'next') slider.appendChild(items[0]);
    else slider.insertBefore(items[items.length - 1], items[0]);
  }
}
