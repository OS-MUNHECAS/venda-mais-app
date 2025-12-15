
import { Customer } from '../app/(tabs)/types/customer';
import { Product } from '../app/(tabs)/types/product';
import { mockCustomers, mockProducts } from '../database/mocks';

export class StorageService {
    private static readonly CUSTOMERS_KEY = '@venda_mais:customers';
    private static readonly PRODUCTS_KEY = '@venda_mais:products';
    private static memoryStorage: { [key: string]: string } = {};

    static async loadCustomers(): Promise<Customer[]> {
        try {
            let customersData: string | null = null;

            if (typeof window !== 'undefined' && window.localStorage) {
                customersData = window.localStorage.getItem(this.CUSTOMERS_KEY);
            } else {
                customersData = this.memoryStorage[this.CUSTOMERS_KEY] || null;
            }

            if (customersData) {
                const customers = JSON.parse(customersData);
                console.log('StorageService.loadCustomers() - Carregados do storage:', customers.length);
                return customers;
            } else {
                console.log('StorageService.loadCustomers() - Primeiro acesso, usando dados mock');
                await this.saveCustomers(mockCustomers);
                return [...mockCustomers];
            }
        } catch (error) {
            console.error('StorageService.loadCustomers() - Erro ao carregar:', error);
            return [...mockCustomers];
        }
    }

    static async saveCustomers(customers: Customer[]): Promise<void> {
        try {
            const customersData = JSON.stringify(customers);

            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem(this.CUSTOMERS_KEY, customersData);
            } else {
                this.memoryStorage[this.CUSTOMERS_KEY] = customersData;
            }

            console.log('StorageService.saveCustomers() - Salvos no storage:', customers.length);
        } catch (error) {
            console.error('StorageService.saveCustomers() - Erro ao salvar:', error);
            throw new Error('Erro ao salvar dados localmente');
        }
    }

    static async clearCustomers(): Promise<void> {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.removeItem(this.CUSTOMERS_KEY);
            } else {
                delete this.memoryStorage[this.CUSTOMERS_KEY];
            }
            console.log('StorageService.clearCustomers() - Dados limpos do storage');
        } catch (error) {
            console.error('StorageService.clearCustomers() - Erro ao limpar:', error);
            throw new Error('Erro ao limpar dados localmente');
        }
    }

    static async hasCustomersData(): Promise<boolean> {
        try {
            let customersData: string | null = null;

            if (typeof window !== 'undefined' && window.localStorage) {
                customersData = window.localStorage.getItem(this.CUSTOMERS_KEY);
            } else {
                customersData = this.memoryStorage[this.CUSTOMERS_KEY] || null;
            }

            return customersData !== null;
        } catch (error) {
            console.error('StorageService.hasCustomersData() - Erro ao verificar:', error);
            return false;
        }
    }

    static async loadProducts(): Promise<Product[]> {
        try {
            let productsData: string | null = null;

            if (typeof window !== 'undefined' && window.localStorage) {
                productsData = window.localStorage.getItem(this.PRODUCTS_KEY);
            } else {
                productsData = this.memoryStorage[this.PRODUCTS_KEY] || null;
            }

            if (productsData) {
                const products = JSON.parse(productsData);
                console.log('StorageService.loadProducts() - Carregados do storage:', products.length);
                return products;
            } else {
                console.log('StorageService.loadProducts() - Primeiro acesso, usando dados mock');
                await this.saveProducts(mockProducts);
                return [...mockProducts];
            }
        } catch (error) {
            console.error('StorageService.loadProducts() - Erro ao carregar:', error);
            return [...mockProducts];
        }
    }

    static async saveProducts(products: Product[]): Promise<void> {
        try {
            const productsData = JSON.stringify(products);

            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem(this.PRODUCTS_KEY, productsData);
            } else {
                this.memoryStorage[this.PRODUCTS_KEY] = productsData;
            }

            console.log('StorageService.saveProducts() - Salvos no storage:', products.length);
        } catch (error) {
            console.error('StorageService.saveProducts() - Erro ao salvar:', error);
            throw new Error('Erro ao salvar dados localmente');
        }
    }

    static async clearProducts(): Promise<void> {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.removeItem(this.PRODUCTS_KEY);
            } else {
                delete this.memoryStorage[this.PRODUCTS_KEY];
            }
            console.log('StorageService.clearProducts() - Dados limpos do storage');
        } catch (error) {
            console.error('StorageService.clearProducts() - Erro ao limpar:', error);
            throw new Error('Erro ao limpar dados localmente');
        }
    }

    static async hasProductsData(): Promise<boolean> {
        try {
            let productsData: string | null = null;

            if (typeof window !== 'undefined' && window.localStorage) {
                productsData = window.localStorage.getItem(this.PRODUCTS_KEY);
            } else {
                productsData = this.memoryStorage[this.PRODUCTS_KEY] || null;
            }

            return productsData !== null;
        } catch (error) {
            console.error('StorageService.hasProductsData() - Erro ao verificar:', error);
            return false;
        }
    }
}