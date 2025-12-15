import { Order } from '../app/(tabs)/types/order';

const API_URL = 'http://localhost:3000'; // Altere para a URL do seu backend

export class OrderService {
  static async create(order: Order): Promise<Order> {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });
    if (!response.ok) {
      throw new Error('Erro ao salvar pedido no backend');
    }
    return response.json();
  }

  static async getAll(): Promise<Order[]> {
    const response = await fetch(`${API_URL}/orders`);
    if (!response.ok) {
      throw new Error('Erro ao buscar pedidos');
    }
    return response.json();
  }
}
