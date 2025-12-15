import { Product, ProductFormData } from '../app/(tabs)/types/product';
import { StorageService } from './storage.service';

export class ProductService {

    static async getAll(): Promise<Product[]> {
        const products = await StorageService.loadProducts();
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log('ProductService.getAll() - Total de produtos:', products.length);
        console.log('ProductService.getAll() - IDs dos produtos:', products.map((p: Product) => p.id_product));
        return [...products];
    }

    static async getById(id: number): Promise<Product | null> {
        const products = await StorageService.loadProducts();
        await new Promise(resolve => setTimeout(resolve, 200));
        const product = products.find((p: Product) => p.id_product === id);
        return product ? { ...product } : null;
    }

    static async search(filters: {
        query?: string;
        active?: boolean;
        category?: string;
        minStock?: number;
    }): Promise<Product[]> {
        const products = await StorageService.loadProducts();
        await new Promise(resolve => setTimeout(resolve, 300));

        let filtered = [...products];

        if (filters.query) {
            const query = filters.query.toLowerCase();
            filtered = filtered.filter((product: Product) =>
                product.name.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query) ||
                product.description?.toLowerCase().includes(query)
            );
        }

        if (filters.active !== undefined) {
            filtered = filtered.filter((product: Product) => product.active === filters.active);
        }

        if (filters.category) {
            filtered = filtered.filter((product: Product) =>
                product.category.toLowerCase() === filters.category?.toLowerCase()
            );
        }

        if (filters.minStock !== undefined) {
            filtered = filtered.filter((product: Product) => product.stock >= filters.minStock!);
        }

        return filtered;
    }

    static async create(productData: ProductFormData): Promise<Product> {
        const products = await StorageService.loadProducts();
        await new Promise(resolve => setTimeout(resolve, 500));

        this.validateProductData(productData);

        const now = new Date().toISOString();
        const nextId = this.getNextId(products);

        const newProduct: Product = {
            id_product: nextId,
            name: productData.name,
            description: productData.description,
            category: productData.category,
            price_cost: productData.price_cost,
            price_sale: productData.price_sale,
            stock: productData.stock,
            net_weight: productData.net_weight,
            gross_weight: productData.gross_weight,
            min_stock: productData.min_stock,
            max_stock: productData.max_stock,
            unit_measure: productData.unit_measure,
            ncm: productData.ncm,
            cest: productData.cest,
            default_discount: productData.default_discount,
            photo_url: productData.photo_url,
            active: productData.active ?? true,
            created_at: now,
        };

        products.push(newProduct);
        console.log('ProductService.create() - Produto criado:', newProduct.id_product, newProduct.name);
        console.log('ProductService.create() - Total de produtos após criação:', products.length);
        await StorageService.saveProducts(products);

        return { ...newProduct };
    }

    static async update(id: number, productData: Partial<ProductFormData>): Promise<Product> {
        const products = await StorageService.loadProducts();
        await new Promise(resolve => setTimeout(resolve, 500));

        const productIndex = products.findIndex((p: Product) => p.id_product === id);
        if (productIndex === -1) {
            throw new Error('Produto não encontrado');
        }

        const existingProduct = products[productIndex];
        const now = new Date().toISOString();

        const updatedProduct: Product = {
            ...existingProduct,
            ...(productData.name !== undefined && { name: productData.name }),
            ...(productData.description !== undefined && { description: productData.description }),
            ...(productData.category !== undefined && { category: productData.category }),
            ...(productData.price_cost !== undefined && { price_cost: productData.price_cost }),
            ...(productData.price_sale !== undefined && { price_sale: productData.price_sale }),
            ...(productData.stock !== undefined && { stock: productData.stock }),
            ...(productData.net_weight !== undefined && { net_weight: productData.net_weight }),
            ...(productData.gross_weight !== undefined && { gross_weight: productData.gross_weight }),
            ...(productData.min_stock !== undefined && { min_stock: productData.min_stock }),
            ...(productData.max_stock !== undefined && { max_stock: productData.max_stock }),
            ...(productData.unit_measure !== undefined && { unit_measure: productData.unit_measure }),
            ...(productData.ncm !== undefined && { ncm: productData.ncm }),
            ...(productData.cest !== undefined && { cest: productData.cest }),
            ...(productData.default_discount !== undefined && { default_discount: productData.default_discount }),
            ...(productData.photo_url !== undefined && { photo_url: productData.photo_url }),
            ...(productData.active !== undefined && { active: productData.active }),
            updated_at: now,
        };

        products[productIndex] = updatedProduct;
        await StorageService.saveProducts(products);

        return { ...updatedProduct };
    }

    static async delete(id: number): Promise<void> {
        const products = await StorageService.loadProducts();
        await new Promise(resolve => setTimeout(resolve, 300));

        const productIndex = products.findIndex((p: Product) => p.id_product === id);
        if (productIndex === -1) {
            throw new Error('Produto não encontrado');
        }

        products[productIndex] = {
            ...products[productIndex],
            active: false,
            updated_at: new Date().toISOString(),
        };
        await StorageService.saveProducts(products);
    }

    static async hardDelete(id: number): Promise<void> {
        const products = await StorageService.loadProducts();
        await new Promise(resolve => setTimeout(resolve, 300));

        const productIndex = products.findIndex((p: Product) => p.id_product === id);
        if (productIndex === -1) {
            throw new Error('Produto não encontrado');
        }

        products.splice(productIndex, 1);
        await StorageService.saveProducts(products);
    }

    private static getNextId(products: Product[]): number {
        if (products.length === 0) return 1;
        return Math.max(...products.map((p: Product) => p.id_product)) + 1;
    }

    private static validateProductData(data: ProductFormData): void {
        if (!data.name?.trim()) {
            throw new Error('Nome é obrigatório');
        }

        if (!data.category?.trim()) {
            throw new Error('Categoria é obrigatória');
        }

        if (data.price_cost < 0) {
            throw new Error('Preço de custo não pode ser negativo');
        }

        if (data.price_sale < 0) {
            throw new Error('Preço de venda não pode ser negativo');
        }

        if (data.price_sale < data.price_cost) {
            throw new Error('Preço de venda não pode ser menor que o preço de custo');
        }

        if (data.stock < 0) {
            throw new Error('Estoque não pode ser negativo');
        }

        if (!data.unit_measure?.trim()) {
            throw new Error('Unidade de medida é obrigatória');
        }

        if (data.min_stock !== undefined && data.min_stock < 0) {
            throw new Error('Estoque mínimo não pode ser negativo');
        }

        if (data.max_stock !== undefined && data.max_stock < 0) {
            throw new Error('Estoque máximo não pode ser negativo');
        }

        if (data.min_stock !== undefined && data.max_stock !== undefined && data.min_stock > data.max_stock) {
            throw new Error('Estoque mínimo não pode ser maior que o estoque máximo');
        }

        if (data.default_discount !== undefined && (data.default_discount < 0 || data.default_discount > 100)) {
            throw new Error('Desconto deve estar entre 0 e 100%');
        }
    }

    static formatCurrency(value: number): string {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    static formatWeight(value: number): string {
        return `${value.toFixed(3)} kg`;
    }

    static calculateMargin(priceCost: number, priceSale: number): number {
        if (priceCost === 0) return 0;
        return ((priceSale - priceCost) / priceCost) * 100;
    }

    static calculateMarkup(priceCost: number, priceSale: number): number {
        if (priceCost === 0) return 0;
        return ((priceSale - priceCost) / priceSale) * 100;
    }
}
