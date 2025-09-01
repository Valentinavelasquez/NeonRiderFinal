import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito/carrito.service';
import { Carrito } from '../../models/carrito/carrito.model';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  // ✅ Variables necesarias
  carritos: Carrito[] = [];
  carritoForm!: FormGroup;
  editMode: boolean = false;
  carritoId?: string;

  constructor(
    private carritoService: CarritoService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadCarritos();

    this.carritoForm = this.fb.group({
      referencia: ['', Validators.required],
      unidades: [1, Validators.required],
      subtotal: [0, Validators.required],
      total: [0, Validators.required],
      metodo_de_pago: ['Contraentrega', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      estados_de_Entrega: ['Empacado']
    });
  }

  // ✅ Cargar lista de carritos
  loadCarritos(): void {
    this.carritoService.getCarritos().subscribe({
      next: (data) => this.carritos = data,
      error: (err) => console.error('Error cargando carritos', err)
    });
  }

  // ✅ Crear carrito
  createCarrito(): void {
    if (this.carritoForm.invalid) return;

    this.carritoService.createCarrito(this.carritoForm.value).subscribe({
      next: (newCarrito) => {
        this.carritos.push(newCarrito);
        this.carritoForm.reset();
      },
      error: (err) => console.error('Error creando carrito', err)
    });
  }

  // ✅ Poner en modo edición
  editCarrito(carrito: Carrito): void {
    this.editMode = true;
    this.carritoId = carrito._id;
    this.carritoForm.patchValue(carrito);
  }

  // ✅ Actualizar carrito
  updateCarrito(): void {
    if (!this.carritoId) return;

    this.carritoService.updateCarrito(this.carritoId, this.carritoForm.value).subscribe({
      next: (updatedCarrito) => {
        this.carritos = this.carritos.map(c => c._id === updatedCarrito._id ? updatedCarrito : c);
        this.cancelEdit();
      },
      error: (err) => console.error('Error actualizando carrito', err)
    });
  }

  // ✅ Eliminar carrito
  deleteCarrito(id: string): void {
    this.carritoService.deleteCarrito(id).subscribe({
      next: () => {
        this.carritos = this.carritos.filter(c => c._id !== id);
      },
      error: (err) => console.error('Error eliminando carrito', err)
    });
  }

  // ✅ Cancelar edición
  cancelEdit(): void {
    this.editMode = false;
    this.carritoId = undefined;
    this.carritoForm.reset();
  }
}
