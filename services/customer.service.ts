// Gerencia operações de clientes
import { Customer, CustomerFormData, Contact } from '../app/(tabs)/types/customer';
import { Address, AddressFormData } from '../app/(tabs)/types/address';
import { StorageService } from './storage.service';

export class CustomerService {

    static async getAll(): Promise<Customer[]> {
        const customers = await StorageService.loadCustomers();
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log('CustomerService.getAll() - Total de clientes:', customers.length);
        console.log('CustomerService.getAll() - IDs dos clientes:', customers.map((c: Customer) => c.id_customer));
        return [...customers];
    }

    static async getById(id: number): Promise<Customer | null> {
        const customers = await StorageService.loadCustomers();
        await new Promise(resolve => setTimeout(resolve, 200));
        const customer = customers.find((c: Customer) => c.id_customer === id);
        return customer ? { ...customer } : null;
    }

    static async search(filters: {
        query?: string;
        active?: boolean;
        personType?: 'F' | 'J';
    }): Promise<Customer[]> {
        const customers = await StorageService.loadCustomers();
        await new Promise(resolve => setTimeout(resolve, 300));

        let filtered = [...customers];

        if (filters.query) {
            const query = filters.query.toLowerCase();
            filtered = filtered.filter((customer: Customer) =>
                customer.person.name.toLowerCase().includes(query) ||
                customer.person.cpf_cnpj.includes(query) ||
                customer.contacts.some((contact: Contact) =>
                    contact.value.toLowerCase().includes(query)
                )
            );
        }

        if (filters.active !== undefined) {
            filtered = filtered.filter((customer: Customer) => customer.active === filters.active);
        }

        if (filters.personType) {
            filtered = filtered.filter((customer: Customer) =>
                customer.person.person_type === filters.personType
            );
        }

        return filtered;
    }

    static async create(customerData: CustomerFormData): Promise<Customer> {
        const customers = await StorageService.loadCustomers();
        await new Promise(resolve => setTimeout(resolve, 500));

        this.validateCustomerData(customerData);
        const existingCustomer = customers.find((c: Customer) =>
            c.person.cpf_cnpj === customerData.cpf_cnpj
        );
        if (existingCustomer) {
            throw new Error('CPF/CNPJ já cadastrado');
        }

        const now = new Date().toISOString();
        const nextId = this.getNextId(customers);

        const customerId = nextId;
        const personId = nextId + 1;

        const newCustomer: Customer = {
            id_customer: customerId,
            person: {
                id_person: personId,
                name: customerData.name,
                person_type: customerData.person_type,
                cpf_cnpj: customerData.cpf_cnpj,
                active: true,
                observations: customerData.observations,
                created_at: now,
            },
            active: customerData.active ?? true,
            last_purchase: null,
            contacts: customerData.contacts.map((contact, index) => ({
                id_contact: nextId + 2 + index,
                ...contact,
                active: true,
                created_at: now,
            })),
            addresses: customerData.addresses?.map(addr => this.convertAddressFormToAddress(addr, nextId + 100)) || [],
            observations: customerData.observations,
            photo_uri: customerData.photo_uri,
            created_at: now,
        };

        customers.push(newCustomer);
        console.log('CustomerService.create() - Cliente criado:', newCustomer.id_customer, newCustomer.person.name);
        console.log('CustomerService.create() - Total de clientes após criação:', customers.length);
        await StorageService.saveCustomers(customers);

        return { ...newCustomer };
    }

    static async update(id: number, customerData: Partial<CustomerFormData>): Promise<Customer> {
        const customers = await StorageService.loadCustomers();
        await new Promise(resolve => setTimeout(resolve, 500));

        const customerIndex = customers.findIndex((c: Customer) => c.id_customer === id);
        if (customerIndex === -1) {
            throw new Error('Cliente não encontrado');
        }

        const existingCustomer = customers[customerIndex];

        if (customerData.cpf_cnpj) {
            const duplicateCustomer = customers.find((c: Customer) =>
                c.person.cpf_cnpj === customerData.cpf_cnpj && c.id_customer !== id
            );
            if (duplicateCustomer) {
                throw new Error('CPF/CNPJ já cadastrado para outro cliente');
            }
        }

        const now = new Date().toISOString();
        const nextId = this.getNextId(customers);

        const updatedCustomer: Customer = {
            ...existingCustomer,
            person: {
                ...existingCustomer.person,
                ...(customerData.name && { name: customerData.name }),
                ...(customerData.person_type && { person_type: customerData.person_type }),
                ...(customerData.cpf_cnpj && { cpf_cnpj: customerData.cpf_cnpj }),
                ...(customerData.observations !== undefined && { observations: customerData.observations }),
                updated_at: now,
            },
            ...(customerData.active !== undefined && { active: customerData.active }),
            ...(customerData.photo_uri !== undefined && { photo_uri: customerData.photo_uri }),
            ...(customerData.contacts && {
                contacts: customerData.contacts.map((contact, index) => ({
                    id_contact: nextId + index,
                    ...contact,
                    active: true,
                    created_at: now,
                    updated_at: now,
                }))
            }),
            ...(customerData.addresses && {
                addresses: customerData.addresses.map(addr => this.convertAddressFormToAddress(addr, nextId + 100))
            }),
            ...(customerData.observations !== undefined && { observations: customerData.observations }),
            updated_at: now,
        };

        customers[customerIndex] = updatedCustomer;
        await StorageService.saveCustomers(customers);

        return { ...updatedCustomer };
    }

    static async delete(id: number): Promise<void> {
        const customers = await StorageService.loadCustomers();
        await new Promise(resolve => setTimeout(resolve, 300));

        const customerIndex = customers.findIndex((c: Customer) => c.id_customer === id);
        if (customerIndex === -1) {
            throw new Error('Cliente não encontrado');
        }

        customers[customerIndex] = {
            ...customers[customerIndex],
            active: false,
            person: {
                ...customers[customerIndex].person,
                active: false,
                updated_at: new Date().toISOString(),
            },
            updated_at: new Date().toISOString(),
        };
        await StorageService.saveCustomers(customers);
    }

    static async hardDelete(id: number): Promise<void> {
        const customers = await StorageService.loadCustomers();
        await new Promise(resolve => setTimeout(resolve, 300));

        const customerIndex = customers.findIndex((c: Customer) => c.id_customer === id);
        if (customerIndex === -1) {
            throw new Error('Cliente não encontrado');
        }

        customers.splice(customerIndex, 1);
        await StorageService.saveCustomers(customers);
    }

    private static getNextId(customers: Customer[]): number {
        if (customers.length === 0) return 1;
        return Math.max(...customers.map((c: Customer) => c.id_customer)) + 1;
    }

    /**
     * Adiciona endereço ao cliente
     */
    static async addAddress(customerId: number, addressData: AddressFormData): Promise<Address> {
        const customers = await StorageService.loadCustomers();
        await new Promise(resolve => setTimeout(resolve, 400));

        const customer = customers.find((c: Customer) => c.id_customer === customerId);
        if (!customer) {
            throw new Error('Cliente não encontrado');
        }

        const now = new Date().toISOString();
        const nextId = this.getNextId(customers);

        const newAddress: Address = {
            id_address: nextId + 200,
            cep: addressData.cep,
            street: addressData.street,
            number: addressData.number,
            complement: addressData.complement,
            neighborhood: addressData.neighborhood,
            city: {
                id_city: addressData.city_id,
                name: 'Cidade Mock', // Em produção seria consultado na base
                state: {
                    id_state: 13,
                    acronym: 'MG',
                    name: 'Minas Gerais',
                    active: true
                },
                active: true
            },
            reference: addressData.reference,
            type: addressData.type,
            is_main: addressData.is_main || false,
            active: true,
            created_at: now,
        };

        customer.addresses.push(newAddress);

        // Salva no storage
        await StorageService.saveCustomers(customers);

        return { ...newAddress };
    }

    /**
     * Remove endereço do cliente
     */
    static async removeAddress(customerId: number, addressId: number): Promise<void> {
        const customers = await StorageService.loadCustomers();
        await new Promise(resolve => setTimeout(resolve, 300));

        const customer = customers.find((c: Customer) => c.id_customer === customerId);
        if (!customer) {
            throw new Error('Cliente não encontrado');
        }

        const addressIndex = customer.addresses.findIndex(a => a.id_address === addressId);
        if (addressIndex === -1) {
            throw new Error('Endereço não encontrado');
        }

        customer.addresses.splice(addressIndex, 1);

        // Salva no storage
        await StorageService.saveCustomers(customers);
    }

    /**
     * Valida dados do cliente
     */
    private static validateCustomerData(data: CustomerFormData): void {
        if (!data.name?.trim()) {
            throw new Error('Nome é obrigatório');
        }

        if (!data.cpf_cnpj?.trim()) {
            throw new Error('CPF/CNPJ é obrigatório');
        }

        if (!data.person_type) {
            throw new Error('Tipo de pessoa é obrigatório');
        }

        // Validação básica de CPF (11 dígitos) e CNPJ (14 dígitos)
        const cleanDoc = data.cpf_cnpj.replace(/\D/g, '');
        if (data.person_type === 'F' && cleanDoc.length !== 11) {
            throw new Error('CPF deve ter 11 dígitos');
        }
        if (data.person_type === 'J' && cleanDoc.length !== 14) {
            throw new Error('CNPJ deve ter 14 dígitos');
        }

        // Validação de contatos
        if (data.contacts) {
            data.contacts.forEach((contact, index) => {
                if (!contact.value?.trim()) {
                    throw new Error(`Contato ${index + 1} não pode estar vazio`);
                }
                if (contact.contact_type === 'E' && !this.isValidEmail(contact.value)) {
                    throw new Error(`Email ${contact.value} é inválido`);
                }
            });
        }
    }

    /**
     * Valida formato de email
     */
    private static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Formata CPF/CNPJ
     */
    static formatDocument(document: string, type: 'F' | 'J'): string {
        const clean = document.replace(/\D/g, '');

        if (type === 'F' && clean.length === 11) {
            return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }

        if (type === 'J' && clean.length === 14) {
            return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }

        return document;
    }

    /**
     * Remove formatação de documento
     */
    static cleanDocument(document: string): string {
        return document.replace(/\D/g, '');
    }

    /**
     * Converte AddressFormData para Address
     */
    private static convertAddressFormToAddress(addressForm: AddressFormData, baseId: number): Address {
        const now = new Date().toISOString();
        return {
            id_address: baseId,
            cep: addressForm.cep,
            street: addressForm.street,
            number: addressForm.number,
            complement: addressForm.complement,
            neighborhood: addressForm.neighborhood,
            city: {
                id_city: addressForm.city_id,
                name: 'Cidade Mock', // Em produção seria consultado na base
                state: {
                    id_state: 13,
                    acronym: 'MG',
                    name: 'Minas Gerais',
                    active: true
                },
                active: true
            },
            reference: addressForm.reference,
            type: addressForm.type,
            is_main: addressForm.is_main || false,
            active: true,
            created_at: now,
        };
    }
}