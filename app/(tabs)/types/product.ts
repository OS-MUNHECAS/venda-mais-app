export interface Product {
  id_product: number;
  name: string;
  price: number;
  stock: number;
  active: boolean;
  category: string;
}

export type FilterType = 'all' | 'active' | 'inactive';
