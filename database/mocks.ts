import { Customer } from '../app/(tabs)/types/customer';
import { Product } from '../app/(tabs)/types/product';

// Dados fictícios de clientes
export const mockCustomers: Customer[] = [
  {
    id_customer: 1,
    person: {
      id_person: 1,
      name: "Diogo Silva",
      person_type: "F",
      cpf_cnpj: "123.456.789-00",
      active: true,
      created_at: "2024-01-15T08:00:00Z"
    },
    active: true,
    last_purchase: null,
    contacts: [
      {
        id_contact: 1,
        contact_type: "E",
        value: "diogo@hotmail.com.br",
        active: true,
        created_at: "2024-01-15T08:00:00Z"
      }
    ],
    addresses: [],
    created_at: "2024-01-15T08:00:00Z"
  },
  {
    id_customer: 2,
    person: {
      id_person: 2,
      name: "Cooxupe",
      person_type: "J",
      cpf_cnpj: "12.345.678/0001-90",
      active: true,
      created_at: "2024-01-10T09:30:00Z"
    },
    active: true,
    last_purchase: "2024-10-01T14:20:00Z",
    contacts: [
      {
        id_contact: 2,
        contact_type: "E",
        value: "contato@cooxupe.com.br",
        active: true,
        created_at: "2024-01-10T09:30:00Z"
      },
      {
        id_contact: 3,
        contact_type: "T",
        value: "(11) 3333-5678",
        active: true,
        created_at: "2024-01-10T09:30:00Z"
      }
    ],
    addresses: [],
    created_at: "2024-01-10T09:30:00Z"
  },
  {
    id_customer: 3,
    person: {
      id_person: 3,
      name: "Leor Gabriel",
      person_type: "F",
      cpf_cnpj: "987.654.321-00",
      active: false,
      created_at: "2024-01-05T14:15:00Z"
    },
    active: false,
    last_purchase: "2024-08-20T16:45:00Z",
    contacts: [
      {
        id_contact: 4,
        contact_type: "E",
        value: "leor.gabriel@gmail.com",
        active: true,
        created_at: "2024-01-05T14:15:00Z"
      },
      {
        id_contact: 5,
        contact_type: "T",
        value: "(11) 88888-9999",
        active: true,
        created_at: "2024-01-05T14:15:00Z"
      }
    ],
    addresses: [],
    created_at: "2024-01-05T14:15:00Z"
  }
];

// Dados fictícios de produtos
export const mockProducts: Product[] = [
  {
    id_product: 1,
    name: "Café Torrado Premium",
    description: "Café especial 100% arábica torrado em pequenos lotes",
    category: "Grãos",
    price_cost: 30.00,
    price_sale: 45.90,
    stock: 150,
    net_weight: 0.5,
    gross_weight: 0.6,
    min_stock: 20,
    max_stock: 300,
    unit_measure: "KG",
    ncm: "09011190",
    cest: "1700100",
    default_discount: 5,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id_product: 2,
    name: "Azeite Extra Virgem",
    description: "Azeite português de primeira prensagem a frio",
    category: "Mercearia",
    price_cost: 18.00,
    price_sale: 28.50,
    stock: 80,
    net_weight: 0.5,
    gross_weight: 0.8,
    unit_measure: "LT",
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id_product: 3,
    name: "Queijo Minas Padrão",
    category: "Laticínios",
    price_cost: 45.00,
    price_sale: 62.00,
    stock: 0,
    unit_measure: "KG",
    active: false,
    created_at: new Date().toISOString(),
  },
  {
    id_product: 4,
    name: "Doce de Leite Artesanal",
    category: "Doces",
    price_cost: 12.00,
    price_sale: 22.00,
    stock: 120,
    unit_measure: "KG",
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id_product: 5,
    name: "Cachaça Envelhecida",
    description: "Cachaça envelhecida em barris de carvalho por 3 anos",
    category: "Bebidas",
    price_cost: 60.00,
    price_sale: 89.90,
    stock: 40,
    unit_measure: "LT",
    ncm: "22089000",
    active: false,
    created_at: new Date().toISOString(),
  }
];
