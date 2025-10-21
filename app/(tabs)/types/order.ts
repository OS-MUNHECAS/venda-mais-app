import { Customer } from './customer';
import { Product } from './product';

export interface OrderItem {
  product: Product;
  quantity: number;
  total_price: number;
}

export interface Order {
  id_order: number;
  customer: Customer | null;
  items: OrderItem[];
  shipping_type: 'CIF' | 'FOB' | 'retirada';
  shipping_cost: number;
  payment_method: string;
  payment_term: string;
  total_amount: number;
  status: 'pendente' | 'confirmado' | 'enviado' | 'entregue' | 'cancelado';
  observations: string;
  delivery_date: string;
  created_at: string;
}
