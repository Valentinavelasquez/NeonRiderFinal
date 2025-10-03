import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../services/product/product';

@Component({
  selector: 'app-cascos-abatibles',
  imports: [RouterLink],
  templateUrl: './cascos-abatibles.html',
  styleUrl: './cascos-abatibles.css'
})
export class CascosAbatibles {
 private productService = inject(Product);
  items: any[] = [];
  categorias: string[] = ['todos', 'integral', 'cross', 'jet']; // 👈 categorías disponibles
  categoriaSeleccionada: string = 'todos';

  ngOnInit() {
    this.renderCascos(this.categoriaSeleccionada);
  }

  renderCascos(categoria: string) {
    this.productService.getCascos().subscribe({
      next: (dataApi: any['todos']['abatible']) => {
        if (categoria === 'todos') {
          this.items = dataApi;
        } else {
          this.items = dataApi.filter((casco: any) => casco.categoria === categoria);
        }
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  onCategoriaChange(categoria: string) {
    this.categoriaSeleccionada = categoria;
    this.renderCascos(categoria);
  }

}
