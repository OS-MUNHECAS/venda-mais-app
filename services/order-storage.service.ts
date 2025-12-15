export async function updateOrder(updatedOrder: Order): Promise<void> {
  try {
    const orders = await loadOrders();
    const idx = orders.findIndex(o => o.id_order === updatedOrder.id_order);
    if (idx !== -1) {
      orders[idx] = updatedOrder;
      await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } else {
      throw new Error('Pedido não encontrado para atualizar.');
    }
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    throw error;
  }
}
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order } from '../app/(tabs)/types/order';

const ORDERS_KEY = '@venda_mais:orders';

export async function loadOrders(): Promise<Order[]> {
  try {
    const data = await AsyncStorage.getItem(ORDERS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Erro ao carregar pedidos:', error);
    return [];
  }
}

export async function saveOrder(order: Order): Promise<void> {
  try {
    const orders = await loadOrders();
    orders.push(order);
    await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error('Erro ao salvar pedido:', error);
    throw error;
  }
}

export async function clearOrders(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ORDERS_KEY);
  } catch (error) {
    console.error('Erro ao limpar pedidos:', error);
    throw error;
  }
}
