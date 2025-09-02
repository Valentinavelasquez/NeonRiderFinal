import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent, IonList, IonItem, IonLabel, IonButton, IonInput, IonHeader, IonToolbar, IonTitle
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import {
  CarritoService,
  CartItem, // 👈 usamos el tipo del servicio
} from '../../services/carrito/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent, IonList, IonItem, IonLabel, IonButton, IonInput,
    IonHeader, IonToolbar, IonTitle
  ],
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-title>Carrito (admin)</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <form [formGroup]="carritoForm" (ngSubmit)="guardar()">
      <ion-item>
        <ion-label position="stacked">Nombre</ion-label>
        <ion-input formControlName="name" required></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Precio</ion-label>
        <ion-input type="number" formControlName="price" required></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Imagen (archivo)</ion-label>
        <ion-input formControlName="image"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Cantidad</ion-label>
        <ion-input type="number" formControlName="qty" required></ion-input>
      </ion-item>

      <div class="ion-padding-top">
        <ion-button type="submit" [disabled]="carritoForm.invalid" expand="block">
          {{ editIndex === null ? 'Crear' : 'Actualizar' }}
        </ion-button>
        <ion-button color="medium" expand="block" (click)="resetForm()" type="button">Cancelar</ion-button>
      </div>
    </form>

    <ion-list class="ion-margin-top">
      <ion-item *ngFor="let c of carritos; let i = index">
        <ion-label>
          <div><strong>{{ c.name }}</strong></div>
          <small>{{ c.price | currency:'COP':'symbol':'1.0-0' }} × {{ c.qty }}</small>
        </ion-label>
        <ion-button fill="clear" (click)="editar(i)">Editar</ion-button>
        <ion-button color="danger" fill="clear" (click)="eliminar(i)">Eliminar</ion-button>
      </ion-item>
    </ion-list>
  </ion-content>
  `,
})
export class CarritoComponent implements OnInit, OnDestroy {
  private carritoService = inject(CarritoService);
  private fb = inject(FormBuilder);

  carritos: CartItem[] = [];
  sub?: Subscription;

  // Usamos índice numérico para editar/eliminar (coincide con el servicio)
  editIndex: number | null = null;

  carritoForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    price: [0, [Validators.required]],
    image: [''],
    qty: [1, [Validators.required]],
  });

  ngOnInit(): void {
    this.sub = this.carritoService.getCarritos().subscribe({
      next: (data: CartItem[]) => (this.carritos = data),
      error: (err: unknown) => console.error('Error cargando carritos', err),
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  resetForm(): void {
    this.editIndex = null;
    this.carritoForm.reset({
      name: '',
      price: 0,
      image: '',
      qty: 1,
    });
  }

  guardar(): void {
    const formVal = this.carritoForm.value as Partial<CartItem>;
    const payload: CartItem = {
      name: String(formVal.name ?? ''),
      price: Number(formVal.price ?? 0),
      image: String(formVal.image ?? ''),
      qty: Number(formVal.qty ?? 1),
    };

    if (this.editIndex === null) {
      // Crear
      this.carritoService.createCarrito(payload).subscribe({
        next: (_created: CartItem) => this.resetForm(),
        error: (err: unknown) => console.error('Error creando carrito', err),
      });
    } else {
      // Actualizar
      this.carritoService.updateCarrito(this.editIndex, payload).subscribe({
        next: (_updated: CartItem) => this.resetForm(),
        error: (err: unknown) => console.error('Error actualizando carrito', err),
      });
    }
  }

  editar(i: number): void {
    this.editIndex = i;
    const it = this.carritos[i];
    if (!it) return;
    this.carritoForm.setValue({
      name: it.name,
      price: it.price,
      image: it.image,
      qty: it.qty,
    });
  }

  eliminar(i: number): void {
    this.carritoService.deleteCarrito(i).subscribe({
      next: () => { /* la lista se actualiza sola vía stream */ },
      error: (err: unknown) => console.error('Error eliminando carrito', err),
    });
  }
}
