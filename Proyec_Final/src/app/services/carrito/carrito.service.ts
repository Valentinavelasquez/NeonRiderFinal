import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export type Product = { name: string; price: number; image: string };
export type CartItem = Product & { qty: number };

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly _items$ = new BehaviorSubject<CartItem[]>([]);

  /** stream de items */
  readonly items$ = this._items$.asObservable();

  /** cantidad total (stream) */
  readonly count$ = this.items$.pipe(
    map(items => items.reduce((acc, it) => acc + it.qty, 0))
  );

  /** total (stream) */
  readonly total$ = this.items$.pipe(
    map(items => items.reduce((acc, it) => acc + it.qty * it.price, 0))
  );

  /** ====== API de carrito (in-memory) ====== */

  /** listar */
  getCarritos(): Observable<CartItem[]> {
    return this.items$;
  }

  /** crear/agregar (si existe, incrementa qty) */
  createCarrito(payload: Product & { qty?: number }): Observable<CartItem> {
    const qty = payload.qty ?? 1;
    const items = [...this._items$.value];
    const i = items.findIndex(x => x.name === payload.name && x.image === payload.image);
    let created: CartItem;

    if (i >= 0) {
      items[i] = { ...items[i], qty: items[i].qty + qty };
      created = items[i];
    } else {
      created = { ...payload, qty };
      items.unshift(created);
    }
    this._items$.next(items);
    return of(created);
  }

  /** actualizar por índice (simple) */
  updateCarrito(index: number, patch: Partial<CartItem>): Observable<CartItem> {
    const items = [...this._items$.value];
    if (index < 0 || index >= items.length) return of(items[index]!);
    items[index] = { ...items[index], ...patch };
    this._items$.next(items);
    return of(items[index]!);
  }

  /** eliminar por índice */
  deleteCarrito(index: number): Observable<void> {
    const items = [...this._items$.value];
    if (index >= 0 && index < items.length) {
      items.splice(index, 1);
      this._items$.next(items);
    }
    return of(void 0);
  }

  /** Helpers directos (si usas desde el grid) */
  add(product: Product, qty = 1) {
    this.createCarrito({ ...product, qty }).pipe(tap()).subscribe();
  }
  clear() { this._items$.next([]); }
}
