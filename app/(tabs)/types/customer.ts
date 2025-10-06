// Tipos para a tela de Clientes

export interface Contact {
  contact_type: 'E' | 'T'; // E = Email, T = Telefone
  value: string;
}

export interface Person {
  id_person: number;
  name: string;
  person_type: 'F' | 'J'; // F = Física, J = Jurídica
  cpf_cnpj: string;
  active: boolean;
}

export interface Customer {
  id_customer: number;
  person: Person;
  active: boolean;
  last_purchase: string | null;
  contacts: Contact[];
}