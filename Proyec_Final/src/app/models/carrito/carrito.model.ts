
export interface Carrito {
  _id?: string;
  referencia: string | {
    _id: string;
    nombre: string;
    precio: number;
    // agrega aquí más campos si tu producto tiene otros
  };
  unidades: number;
  subtotal: number;
  total: number;
  metodo_de_pago: 'Contraentrega' | 'Transferencia' | 'Nequi' | 'Daviplata';
  direccion: string;
  telefono: number;
  estados_de_Entrega: 'Empacado' | 'En transito' | 'En reparto' | 'Entregado';
}
