// Serviço para gerenciar persistência local usando localStorage (web) ou memoria (mobile)
import { Customer } from '../app/(tabs)/types/customer';
import { mockCustomers } from '../database/mocks';

export class StorageService {
    private static readonly CUSTOMERS_KEY = '@venda_mais:customers';
    private static memoryStorage: { [key: string]: string } = {};

    /**
     * Carrega todos os clientes do storage
     */
    static async loadCustomers(): Promise<Customer[]> {
        try {
            let customersData: string | null = null;

            // Tenta usar localStorage se disponível (web)
            if (typeof window !== 'undefined' && window.localStorage) {
                customersData = window.localStorage.getItem(this.CUSTOMERS_KEY);
            } else {
                // Fallback para memória em outros ambientes
                customersData = this.memoryStorage[this.CUSTOMERS_KEY] || null;
            }

            if (customersData) {
                const customers = JSON.parse(customersData);
                console.log('StorageService.loadCustomers() - Carregados do storage:', customers.length);
                return customers;
            } else {
                // Se não há dados no storage, usa os dados mock iniciais
                console.log('StorageService.loadCustomers() - Primeiro acesso, usando dados mock');
                await this.saveCustomers(mockCustomers);
                return [...mockCustomers];
            }
        } catch (error) {
            console.error('StorageService.loadCustomers() - Erro ao carregar:', error);
            return [...mockCustomers]; // Fallback para dados mock
        }
    }

    /**
     * Salva todos os clientes no storage
     */
    static async saveCustomers(customers: Customer[]): Promise<void> {
        try {
            const customersData = JSON.stringify(customers);

            // Tenta usar localStorage se disponível (web)
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem(this.CUSTOMERS_KEY, customersData);
            } else {
                // Fallback para memória em outros ambientes
                this.memoryStorage[this.CUSTOMERS_KEY] = customersData;
            }

            console.log('StorageService.saveCustomers() - Salvos no storage:', customers.length);
        } catch (error) {
            console.error('StorageService.saveCustomers() - Erro ao salvar:', error);
            throw new Error('Erro ao salvar dados localmente');
        }
    }

    /**
     * Limpa todos os dados de clientes do storage
     */
    static async clearCustomers(): Promise<void> {
        try {
            // Tenta usar localStorage se disponível (web)
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.removeItem(this.CUSTOMERS_KEY);
            } else {
                // Fallback para memória em outros ambientes
                delete this.memoryStorage[this.CUSTOMERS_KEY];
            }
            console.log('StorageService.clearCustomers() - Dados limpos do storage');
        } catch (error) {
            console.error('StorageService.clearCustomers() - Erro ao limpar:', error);
            throw new Error('Erro ao limpar dados localmente');
        }
    }

    /**
     * Verifica se existem dados de clientes no storage
     */
    static async hasCustomersData(): Promise<boolean> {
        try {
            let customersData: string | null = null;

            // Tenta usar localStorage se disponível (web)
            if (typeof window !== 'undefined' && window.localStorage) {
                customersData = window.localStorage.getItem(this.CUSTOMERS_KEY);
            } else {
                // Fallback para memória em outros ambientes
                customersData = this.memoryStorage[this.CUSTOMERS_KEY] || null;
            }

            return customersData !== null;
        } catch (error) {
            console.error('StorageService.hasCustomersData() - Erro ao verificar:', error);
            return false;
        }
    }
}