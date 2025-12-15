import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Order } from '../app/(tabs)/types/order';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  visible: boolean;
  order: Order | null;
  onClose: () => void;
}

export default function OrderDetailsScreen({ visible, order, onClose }: Props) {
  const { theme } = useTheme();
  if (!order) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.card }] }>
          <ScrollView>
            <Text style={[styles.title, { color: theme.text }]}>Pedido #{order.id_order}</Text>
            <Text style={{ color: theme.textSecondary }}>Cliente: {order.customer?.person.name}</Text>
            <Text style={{ color: theme.textSecondary }}>Status: {order.status}</Text>
            <Text style={{ color: theme.textSecondary }}>Data: {order.created_at ? new Date(order.created_at).toLocaleString() : '-'}</Text>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Itens</Text>
            {order.items.map(item => (
              <View key={item.product.id_product} style={styles.itemRow}>
                <Text style={{ color: theme.text }}>{item.quantity}x {item.product.name}</Text>
                <Text style={{ color: theme.textSecondary }}>R$ {item.total_price.toFixed(2)}</Text>
              </View>
            ))}
            <Text style={{ color: theme.textSecondary, marginTop: 8 }}>Total: R$ {order.total_amount?.toFixed(2)}</Text>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Pagamento</Text>
            <Text style={{ color: theme.textSecondary }}>Método: {order.payment_method?.description}</Text>
            <Text style={{ color: theme.textSecondary }}>Frete: R$ {order.shipping_cost?.toFixed(2)}</Text>
            <Text style={{ color: theme.textSecondary }}>Tipo de Frete: {order.shipping_type}</Text>
            {order.observations ? (
              <Text style={{ color: theme.textSecondary, marginTop: 8 }}>Obs: {order.observations}</Text>
            ) : null}
          </ScrollView>
          <TouchableOpacity style={[styles.closeButton, { backgroundColor: theme.primary }]} onPress={onClose}>
            <Text style={{ color: theme.buttonText, fontWeight: 'bold' }}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxHeight: '85%',
    borderRadius: 12,
    padding: 20,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  closeButton: {
    marginTop: 18,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});
