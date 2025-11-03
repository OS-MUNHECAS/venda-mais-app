// Serviço para integração com ViaCEP
import { ViaCEPResponse } from '../app/(tabs)/types/address';

export class ViaCEPService {
    private static readonly BASE_URL = 'https://viacep.com.br/ws';

    /**
     * Busca informações de endereço pelo CEP
     * @param cep CEP com ou sem formatação (ex: "01234-567" ou "01234567")
     * @returns Promise com dados do endereço ou null se não encontrado
     */
    static async searchByCEP(cep: string): Promise<ViaCEPResponse | null> {
        try {
            // Remove formatação do CEP
            const cleanCEP = cep.replace(/\D/g, '');

            // Validação básica do CEP
            if (cleanCEP.length !== 8) {
                throw new Error('CEP deve conter 8 dígitos');
            }

            const response = await fetch(`${this.BASE_URL}/${cleanCEP}/json/`);

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }

            const data: ViaCEPResponse = await response.json();

            // ViaCEP retorna um objeto com a propriedade 'erro' quando o CEP não existe
            if (data.erro) {
                return null;
            }

            return data;
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            throw new Error('Erro ao consultar o CEP. Verifique sua conexão com a internet.');
        }
    }

    /**
     * Busca CEPs por cidade e logradouro
     * @param uf Sigla do estado (ex: "MG")
     * @param city Nome da cidade (ex: "Lavras")
     * @param street Nome da rua/logradouro (ex: "Rua das Flores")
     * @returns Promise com array de endereços encontrados
     */
    static async searchByAddress(uf: string, city: string, street: string): Promise<ViaCEPResponse[]> {
        try {
            // Remove acentos e caracteres especiais
            const cleanUF = uf.toUpperCase();
            const cleanCity = encodeURIComponent(city.toLowerCase());
            const cleanStreet = encodeURIComponent(street.toLowerCase());

            const response = await fetch(`${this.BASE_URL}/${cleanUF}/${cleanCity}/${cleanStreet}/json/`);

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }

            const data: ViaCEPResponse[] = await response.json();

            // Se retornar um objeto com erro ao invés de array, não encontrou resultados
            if (!Array.isArray(data)) {
                return [];
            }

            return data;
        } catch (error) {
            console.error('Erro ao buscar endereço:', error);
            throw new Error('Erro ao consultar o endereço. Verifique sua conexão com a internet.');
        }
    }

    /**
     * Formata CEP no padrão brasileiro (xxxxx-xxx)
     * @param cep CEP sem formatação
     * @returns CEP formatado
     */
    static formatCEP(cep: string): string {
        const cleanCEP = cep.replace(/\D/g, '');

        if (cleanCEP.length !== 8) {
            return cep; // Retorna original se não tiver 8 dígitos
        }

        return `${cleanCEP.substring(0, 5)}-${cleanCEP.substring(5)}`;
    }

    /**
     * Remove formatação do CEP
     * @param cep CEP com formatação
     * @returns CEP limpo (apenas números)
     */
    static cleanCEP(cep: string): string {
        return cep.replace(/\D/g, '');
    }

    /**
     * Valida se o CEP tem formato correto
     * @param cep CEP para validar
     * @returns true se válido, false caso contrário
     */
    static isValidCEP(cep: string): boolean {
        const cleanCEP = this.cleanCEP(cep);
        return cleanCEP.length === 8 && /^\d{8}$/.test(cleanCEP);
    }
}

// Hook personalizado para uso em componentes React
export const useViaCEP = () => {
    const searchByCEP = async (cep: string) => {
        return await ViaCEPService.searchByCEP(cep);
    };

    const searchByAddress = async (uf: string, city: string, street: string) => {
        return await ViaCEPService.searchByAddress(uf, city, street);
    };

    return {
        searchByCEP,
        searchByAddress,
        formatCEP: ViaCEPService.formatCEP,
        cleanCEP: ViaCEPService.cleanCEP,
        isValidCEP: ViaCEPService.isValidCEP
    };
};