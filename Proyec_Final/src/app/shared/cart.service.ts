import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Product {
  name: string;
  price?: number;        // precio numérico (opcional si usas priceLabel)
  priceLabel?: string;   // etiqueta de precio formateado
  thumb: string;         // ruta/URL de la imagen
}

export interface CartItem extends Product {
  qty: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private storageKey = 'cart_items_v1';

  private _items$ = new BehaviorSubject<CartItem[]>(this.readStorage());
  readonly items$ = this._items$.asObservable();

  private _open$ = new BehaviorSubject<boolean>(false);
  readonly open$ = this._open$.asObservable();

  constructor() {}

  /** ===== Getters de estado ===== */
  get items(): CartItem[] {
    return this._items$.value;
  }

  get count(): number {
    return this.items.reduce((acc, i) => acc + i.qty, 0);
  }

  get subtotal(): number {
    return this.items.reduce((acc, i) => acc + (i.price ?? 0) * i.qty, 0);
  }

  get discount(): number {
    // Implementa tu lógica de descuento aquí (por ahora 0)
    return 0;
  }

  get total(): number {
    return this.subtotal - this.discount;
  }

  /** ===== Acciones de carrito ===== */
  add(product: Product, quantity = 1): void {
    const list = [...this.items];
    const idx = list.findIndex(i => i.name === product.name);

    if (idx >= 0) {
      list[idx] = { ...list[idx], qty: list[idx].qty + quantity };
    } else {
      list.push({ ...product, qty: quantity });
    }

    this._items$.next(list);
    this.writeStorage(list);
    this.open(); // abre el modal al agregar
  }

  inc(name: string): void {
    const list = this.items.map(i => (i.name === name ? { ...i, qty: i.qty + 1 } : i));
    this._items$.next(list);
    this.writeStorage(list);
  }

  dec(name: string): void {
    const list = this.items
      .map(i => (i.name === name ? { ...i, qty: Math.max(1, i.qty - 1) } : i))
      .filter(i => i.qty > 0);
    this._items$.next(list);
    this.writeStorage(list);
  }

  setQty(name: string, qty: number): void {
    if (!Number.isFinite(qty) || qty <= 0) {
      this.remove(name);
      return;
    }
    const list = this.items.map(i => (i.name === name ? { ...i, qty } : i));
    this._items$.next(list);
    this.writeStorage(list);
  }

  remove(name: string): void {
    const list = this.items.filter(i => i.name !== name);
    this._items$.next(list);
    this.writeStorage(list);
  }

  clear(): void {
    this._items$.next([]);
    this.writeStorage([]);
  }

  /** ===== Control del modal ===== */
  open(): void {
    this._open$.next(true);
    try { document.body.classList.add('cart-open'); } catch {}
  }

  close(): void {
    this._open$.next(false);
    try { document.body.classList.remove('cart-open'); } catch {}
  }

  /** ===== Persistencia ===== */
  private writeStorage(list: CartItem[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(list));
    } catch {}
  }

  private readStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) as CartItem[] : [];
    } catch {
      return [];
    }
  }
}
