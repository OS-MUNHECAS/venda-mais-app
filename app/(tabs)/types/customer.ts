// Tipos para a tela de Clientes
import { Address, AddressFormData } from './address';

export interface Contact {
    id_contact: number;
    contact_type: 'E' | 'T' | 'W'; // E = Email, T = Telefone, W = WhatsApp
    value: string;
    active: boolean;
    created_at: string;
    updated_at?: string;
}

export interface Person {
    id_person: number;
    name: string;
    person_type: 'F' | 'J'; // F = Física, J = Jurídica
    cpf_cnpj: string;
    active: boolean;
    observations?: string;
    created_at: string;
    updated_at?: string;
}

export interface Customer {
    id_customer: number;
    person: Person;
    active: boolean;
    last_purchase: string | null;
    contacts: Contact[];
    addresses: Address[];
    observations?: string;
    photo_uri?: string; // URI da foto do cliente
    created_at: string;
    updated_at?: string;
}

// Tipo para dados de contato no formulário
export interface ContactFormData {
    contact_type: 'E' | 'T' | 'W';
    value: string;
}

// Tipo para criação/edição de cliente
export interface CustomerFormData {
    name: string;
    person_type: 'F' | 'J';
    cpf_cnpj: string;
    active?: boolean;
    observations?: string;
    contacts: ContactFormData[];
    addresses?: AddressFormData[];
    photo_uri?: string; // URI da foto do cliente
}

export type FilterType = 'all' | 'active' | 'inactive';