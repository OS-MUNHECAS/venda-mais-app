import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadOrders } from './order-storage.service';

const ORDERS_KEY = '@venda_mais:orders';

export async function deleteOrder(id_order: number): Promise<void> {
  try {
    const orders = await loadOrders();
    const filtered = orders.filter(o => o.id_order !== id_order);
    await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Erro ao deletar pedido:', error);
    throw error;
  }
}
