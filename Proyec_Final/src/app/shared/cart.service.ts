import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Product {
  name: string;
  priceLabel: string;
  thumb: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private _open$ = new BehaviorSubject<boolean>(false);
  open$ = this._open$.asObservable();

  private _items$ = new BehaviorSubject<Product[]>([]);
  items$ = this._items$.asObservable();

  get items(): Product[] { return this._items$.value; }

  open() { this._open$.next(true); }
  close() { this._open$.next(false); }
  toggle() { this._open$.next(!this._open$.value); }

  add(product: Product) {
    this._items$.next([...this.items, product]);
    this.open();
  }

  clear() { this._items$.next([]); }

  get subtotal(): number {
    return this.items.reduce((acc, it) => {
      const m = it.priceLabel.match(/\$([\d.]+)/);
      return acc + (m ? parseFloat(m[1]) : 0);
    }, 0);
  }
}
