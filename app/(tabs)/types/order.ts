import { Customer } from './customer';
import { Product } from './product';
import { Address } from './address';

export interface OrderItem {
  id_item: number;
  product: Product;
  quantity: number;
  unit_price: number;
  discount: number;
  total_price: number;
  observations?: string;
  created_at: string;
}

export interface PaymentMethod {
  id_payment: number;
  description: string;
  rate: number;
  term_days: number;
  active: boolean;
}

export interface StatusHistory {
  id_history: number;
  previous_status: string | null;
  new_status: string;
  change_date: string;
  observation?: string;
  user?: string;
}

export interface ShippingInfo {
  id_shipping: number;
  carrier?: string;
  tracking_code?: string;
  delivery_term?: number; // dias úteis
  total_weight?: number;
  declared_value?: number;
  posting_date?: string;
  created_at: string;
  updated_at?: string;
}

export interface Order {
  id_order: number;
  customer: Customer | null;
  seller_id: number;
  delivery_address?: Address | null; // Endereço de entrega (opcional para retirada)
  items: OrderItem[];
  products_value: number;
  shipping_cost: number;
  discount_value: number;
  total_amount: number;
  shipping_type: 'CIF' | 'FOB' | 'RET'; // CIF = Custo, seguro e frete por conta do vendedor, FOB = Frete por conta do comprador, RET = Retirada
  payment_method: PaymentMethod;
  status: 'Pendente' | 'Confirmado' | 'Enviado' | 'Entregue' | 'Cancelado';
  order_number?: string;
  expected_delivery_date?: string;
  delivery_date?: string;
  observations?: string;
  status_history: StatusHistory[];
  shipping_info?: ShippingInfo;
  created_at: string;
  updated_at?: string;
}

// Tipo para criação de pedido
export interface OrderFormData {
  customer_id: number;
  delivery_address_id?: number;
  items: Omit<OrderItem, 'id_item' | 'created_at'>[];
  shipping_type: 'CIF' | 'FOB' | 'RET';
  payment_method_id: number;
  expected_delivery_date?: string;
  observations?: string;
}
