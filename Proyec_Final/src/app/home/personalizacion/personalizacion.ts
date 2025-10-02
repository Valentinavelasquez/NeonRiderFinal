import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-personalizacion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './personalizacion.html',
  styleUrls: ['./personalizacion.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Personalizacion {
  currentSrc = 'assets/models/helmet.glb';
  tint = 'transparent';
  colorHex = '#4c8cff';

  @ViewChild('mv') mv?: ElementRef<HTMLElement>;

  onLoad() {
    // Aquí puedes tocar el scene-graph del modelo si lo necesitas más adelante
    // (this.mv?.nativeElement as any)?.dismissPoster?.();
  }

  onError(e: Event) {
    console.error('Error al cargar el modelo', e);
  }

  setColor(hex: string) {
    this.colorHex = hex;
    this.tint = `${hex}80`;
  }

  reset() {
    this.tint = 'transparent';
    this.colorHex = '#4c8cff';
    const cur = this.currentSrc;
    this.currentSrc = '';
    setTimeout(() => (this.currentSrc = cur));
  }
}
