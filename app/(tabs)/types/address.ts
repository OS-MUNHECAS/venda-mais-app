// Tipos para integração com ViaCEP e sistema de endereços

export interface State {
    id_state: number;
    acronym: string; // Sigla do estado (ex: "MG", "SP")
    name: string;
    active: boolean;
}

export interface City {
    id_city: number;
    name: string;
    ibge_code?: string;
    state: State;
    active: boolean;
}

export interface Address {
    id_address: number;
    cep: string;
    street: string;
    number?: string;
    complement?: string;
    neighborhood: string;
    city: City;
    reference?: string;
    type: 'C' | 'R' | 'E'; // C = Comercial, R = Residencial, E = Entrega
    is_main: boolean;
    active: boolean;
    created_at: string;
    updated_at?: string;
}

// Resposta da API do ViaCEP
export interface ViaCEPResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
    erro?: boolean;
}

// Para formulários de endereço
export interface AddressFormData {
    cep: string;
    street: string;
    number?: string;
    complement?: string;
    neighborhood: string;
    city_id: number;
    reference?: string;
    type: 'C' | 'R' | 'E';
    is_main?: boolean;
}

// Tipos para relacionamentos
export interface CustomerAddress {
    customer_id: number;
    address: Address;
    created_at: string;
}

export interface SellerAddress {
    seller_id: number;
    address: Address;
    created_at: string;
}