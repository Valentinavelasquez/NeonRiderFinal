import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export interface CartItem {
  id: string;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  precio: number;
  qty: number;
  // guarda el objeto original por si necesitas otros campos
  raw?: any;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items$  = new BehaviorSubject<CartItem[]>([]);
  private readonly _isOpen$ = new BehaviorSubject<boolean>(false);

  // Observables públicos
  readonly items$  = this._items$.asObservable();
  readonly isOpen$ = this._isOpen$.asObservable();

  readonly total$ = this.items$.pipe(
    map(items => items.reduce((acc, it) => acc + it.precio * it.qty, 0))
  );

  readonly count$ = this.items$.pipe(
    map(items => items.reduce((acc, it) => acc + it.qty, 0))
  );

  open()  { this._isOpen$.next(true); }
  close() { this._isOpen$.next(false); }
  toggle(){ this._isOpen$.next(!this._isOpen$.value); }

  clear() { this._items$.next([]); }

  /**
   * Agrega al carrito. Acepta tu objeto de API o un CartItem.
   */
  add(item: any, qty = 1) {
    const parsed = this.parseToCartItem(item, qty);
    const list = [...this._items$.value];
    const i = list.findIndex(x => x.id === parsed.id);
    if (i >= 0) list[i] = { ...list[i], qty: list[i].qty + parsed.qty };
    else list.push(parsed);
    this._items$.next(list);
    this.open();
  }

  /** Elimina por id */
  remove(id: string) {
    const list = this._items$.value.filter(x => x.id !== id);
    this._items$.next(list);
  }

  private parseToCartItem(src: any, qty: number): CartItem {
    // Compatibilidad con tu backend (Imagen, Descripcion, referencia, Precio)
    const id  = (src?._id ?? src?.id ?? src?.referencia ?? Math.random().toString(36).slice(2)) + '';
    const nombre = src?.referencia ?? src?.nombre ?? 'Producto';
    const descripcion = src?.Descripcion ?? src?.descripcion ?? '';
    const imagen = src?.Imagen ?? src?.img ?? '';
    const precio = Number(src?.Precio ?? src?.precio ?? 0);

    return { id, nombre, descripcion, imagen, precio, qty: Number(qty) || 1, raw: src };
  }
}
