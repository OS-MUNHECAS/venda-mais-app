export interface Product {
  id_product: number;
  name: string;
  description?: string;
  category: string;
  price_cost: number;
  price_sale: number;
  stock: number;
  net_weight?: number; // peso líquido em kg
  gross_weight?: number; // peso bruto em kg
  min_stock?: number; // estoque mínimo
  max_stock?: number; // estoque máximo
  unit_measure: string; // unidade de medida (UN, KG, LT, etc)
  ncm?: string; // Nomenclatura Comum do Mercosul
  cest?: string; // Código Especificador da Substituição Tributária
  default_discount?: number; // desconto padrão em %
  photo_url?: string; // URL da foto do produto
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Para compatibilidade com código existente
export interface LegacyProduct {
  id_product: number;
  name: string;
  price: number;
  stock: number;
  active: boolean;
  category: string;
}

export type FilterType = 'all' | 'active' | 'inactive';
