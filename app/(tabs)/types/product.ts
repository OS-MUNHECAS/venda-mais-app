export interface Product {
  id_product: number;
  name: string;
  description?: string;
  category: string;
  price_cost: number;
  price_sale: number;
  stock: number;
  net_weight?: number;
  gross_weight?: number;
  min_stock?: number;
  max_stock?: number;
  unit_measure: string;
  ncm?: string;
  cest?: string;
  default_discount?: number;
  photo_url?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  category: string;
  price_cost: number;
  price_sale: number;
  stock: number;
  net_weight?: number;
  gross_weight?: number;
  min_stock?: number;
  max_stock?: number;
  unit_measure: string;
  ncm?: string;
  cest?: string;
  default_discount?: number;
  photo_url?: string;
  active?: boolean;
}

export type FilterType = 'all' | 'active' | 'inactive';
