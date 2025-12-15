
import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import OrderDetailsScreen from '../../components/OrderDetailsScreen';
import { useTheme } from '../../contexts/ThemeContext';
import { deleteOrder } from '../../services/order-delete.service';
import { loadOrders } from '../../services/order-storage.service';
import { Order } from './types/order';


export default function HistoricoScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const isFocused = typeof useIsFocused === 'function' ? useIsFocused() : true;
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (isFocused) {
      loadOrdersData();
    }
  }, [isFocused]);

  const loadOrdersData = async () => {
    try {
      const data = await loadOrders();
      setOrders(data);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      Alert.alert('Erro', 'Não foi possível carregar o histórico de pedidos');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Histórico de Pedidos</Text>
      {orders.length === 0 ? (
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Nenhum pedido realizado ainda.</Text>
      ) : (
        <FlatList
          data={orders.sort((a, b) => (b.created_at > a.created_at ? 1 : -1))}
          keyExtractor={item => item.id_order.toString()}
          renderItem={({ item }) => (
            <View style={[styles.orderCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.orderTitle, { color: theme.text }]}>Pedido #{item.id_order}</Text>
              <Text style={{ color: theme.textSecondary }}>Cliente: {item.customer?.person.name}</Text>
              <Text style={{ color: theme.textSecondary }}>Total: R$ {item.total_amount?.toFixed(2)}</Text>
              <Text style={{ color: theme.textSecondary }}>Data: {item.created_at ? new Date(item.created_at).toLocaleString() : '-'}</Text>
              <Text style={{ color: theme.textSecondary }}>Status: {item.status}</Text>
              <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
                <Text style={{ color: theme.primary, marginRight: 16 }} onPress={() => { setSelectedOrder(item); setModalVisible(true); }}>Ver detalhes</Text>
                {/* Edição de pedidos temporariamente desabilitada */}
                {/* <Text style={{ color: theme.primary, marginRight: 16, fontWeight: 'bold' }} onPress={() => {
                  navigation.navigate('pedidos' as never, { orderToEdit: item } as never);
                }}>Editar</Text> */}
                <Text style={{ color: 'red', fontWeight: 'bold' }} onPress={async () => {
                  try {
                    await deleteOrder(item.id_order);
                    await loadOrdersData();
                  } catch (error) {
                    Alert.alert('Erro', 'Não foi possível excluir o pedido');
                  }
                }}>Excluir</Text>
              </View>
            </View>
          )}
        />
      )}
      <OrderDetailsScreen visible={modalVisible} order={selectedOrder} onClose={() => setModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  orderCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
