import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { mockCustomers, mockProducts } from '../../database/mocks'; // Importando dados fictícios
import { Customer } from './types/customer';
import { Order, OrderItem } from './types/order';
import { Product } from './types/product';

type WizardStep = 'customer' | 'products' | 'shipping' | 'review' | 'confirmation';

export default function PedidosScreen() {
  const [step, setStep] = useState<WizardStep>('customer');
  const [order, setOrder] = useState<Partial<Order>>({
    items: [],
    shipping_cost: 0,
    total_amount: 0,
  });

  const handleSelectCustomer = (customer: Customer) => {
    setOrder({ ...order, customer });
    setStep('products');
  };

  const handleUpdateItem = (product: Product, quantity: number) => {
    const existingItemIndex = order.items?.findIndex(i => i.product.id_product === product.id_product) ?? -1;
    let newItems = [...(order.items || [])];

    if (quantity > 0) {
      const newItem: OrderItem = { product, quantity, total_price: product.price * quantity };
      if (existingItemIndex > -1) {
        newItems[existingItemIndex] = newItem;
      } else {
        newItems.push(newItem);
      }
    } else {
      if (existingItemIndex > -1) {
        newItems.splice(existingItemIndex, 1);
      }
    }

    const total_amount = newItems.reduce((sum, item) => sum + item.total_price, 0);
    setOrder({ ...order, items: newItems, total_amount });
  };

  const handleFinalizeOrder = () => {
    if (!order.customer || !order.items?.length || !order.payment_method || !order.delivery_date) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios antes de finalizar.");
      return;
    }
    // Simula a finalização
    console.log("Pedido Finalizado:", order);
    setStep('confirmation');
  };
  
  const resetOrder = () => {
    setOrder({
      items: [],
      shipping_cost: 0,
      total_amount: 0,
    });
    setStep('customer');
  };

  const renderStep = () => {
    switch (step) {
      case 'customer':
        return <CustomerStep onSelectCustomer={handleSelectCustomer} />;
      case 'products':
        return <ProductsStep order={order} onUpdateItem={handleUpdateItem} onNext={() => setStep('shipping')} onBack={() => setStep('customer')} />;
      case 'shipping':
        return <ShippingStep order={order} setOrder={setOrder} onNext={() => setStep('review')} onBack={() => setStep('products')} />;
      case 'review':
        return <ReviewStep order={order} setOrder={setOrder} onFinalize={handleFinalizeOrder} onBack={() => setStep('shipping')} />;
      case 'confirmation':
        return <ConfirmationStep onReset={resetOrder} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#ff8f00" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Emissão de Pedido</Text>
        <Text style={styles.headerSubtitle}>Passo: {step.charAt(0).toUpperCase() + step.slice(1)}</Text>
      </View>
      {renderStep()}
    </SafeAreaView>
  );
}

// Step 1: Customer Selection
const CustomerStep = ({ onSelectCustomer }: { onSelectCustomer: (customer: Customer) => void }) => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Selecione o Cliente</Text>
    <FlatList
      data={mockCustomers.filter(c => c.active)}
      keyExtractor={item => item.id_customer.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.listItem} onPress={() => onSelectCustomer(item)}>
          <Text style={styles.listItemTitle}>{item.person.name}</Text>
          <Text style={styles.listItemSubtitle}>{item.person.cpf_cnpj}</Text>
        </TouchableOpacity>
      )}
    />
  </View>
);

// Step 2: Product Selection
const ProductsStep = ({ order, onUpdateItem, onNext, onBack }: { order: Partial<Order>, onUpdateItem: (product: Product, quantity: number) => void, onNext: () => void, onBack: () => void }) => {
  const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  
  return (
    <View style={styles.stepContainer}>
       <Text style={styles.stepTitle}>Adicione os Produtos</Text>
      <FlatList
        data={mockProducts.filter(p => p.active)}
        keyExtractor={item => item.id_product.toString()}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.listItemTitle}>{item.name}</Text>
              <Text style={styles.listItemSubtitle}>R$ {item.price.toFixed(2)}</Text>
            </View>
            <TextInput
              style={styles.quantityInput}
              keyboardType="numeric"
              placeholder="Qtd"
              onChangeText={text => onUpdateItem(item, Number(text))}
              defaultValue={order.items?.find(i => i.product.id_product === item.id_product)?.quantity.toString() || ''}
            />
          </View>
        )}
        ListFooterComponent={<View style={{ height: 80 }}/>}
      />
       <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
        <View style={styles.summary}>
          <Text>Itens: {totalItems}</Text>
          <Text style={styles.totalAmount}>Total: R$ {order.total_amount?.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.buttonText}>Avançar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Step 3: Shipping and Payment
const ShippingStep = ({ order, setOrder, onNext, onBack }: { order: Partial<Order>, setOrder: (order: Partial<Order>) => void, onNext: () => void, onBack: () => void }) => {
  const shippingTypes: Order['shipping_type'][] = ['CIF', 'FOB', 'retirada'];
  const paymentMethods = ['Cartão de Crédito', 'Boleto', 'PIX', 'Dinheiro'];
  const paymentTerms = ['À vista', '7/14/21', '10/15/20', '30/60/90'];

  const handleSelectShippingType = (type: Order['shipping_type']) => {
    const newOrder = { ...order, shipping_type: type };
    if (type === 'retirada') {
      newOrder.shipping_cost = 0;
    }
    setOrder(newOrder);
  };

  return (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Frete e Pagamento</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tipo de Frete</Text>
        <View style={styles.chipContainer}>
          {shippingTypes.map(type => (
            <TouchableOpacity
              key={type}
              style={[styles.chip, order.shipping_type === type && styles.chipSelected]}
              onPress={() => handleSelectShippingType(type)}
            >
              <Text style={[styles.chipText, order.shipping_type === type && styles.chipTextSelected]}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Custo do Frete</Text>
        <TextInput
          style={[styles.input, order.shipping_type === 'retirada' && styles.inputDisabled]}
          keyboardType="numeric"
          placeholder="R$ 0,00"
          value={order.shipping_cost?.toString()}
          onChangeText={text => setOrder({ ...order, shipping_cost: Number(text) })}
          editable={order.shipping_type !== 'retirada'}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Método de Pagamento</Text>
        <View style={styles.chipContainer}>
          {paymentMethods.map(method => (
            <TouchableOpacity
              key={method}
              style={[styles.chip, order.payment_method === method && styles.chipSelected]}
              onPress={() => setOrder({ ...order, payment_method: method })}
            >
              <Text style={[styles.chipText, order.payment_method === method && styles.chipTextSelected]}>{method}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Prazo de Pagamento</Text>
        <View style={styles.chipContainer}>
          {paymentTerms.map(term => (
            <TouchableOpacity
              key={term}
              style={[styles.chip, order.payment_term === term && styles.chipSelected]}
              onPress={() => setOrder({ ...order, payment_term: term })}
            >
              <Text style={[styles.chipText, order.payment_term === term && styles.chipTextSelected]}>{term}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.buttonText}>Avançar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Step 4: Review
const ReviewStep = ({ order, setOrder, onFinalize, onBack }: { order: Partial<Order>, setOrder: (order: Partial<Order>) => void, onFinalize: () => void, onBack: () => void }) => {
  const finalTotal = (order.total_amount || 0) + (order.shipping_cost || 0);

  return (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Revisão do Pedido</Text>
      <View style={styles.reviewSection}>
        <Text style={styles.reviewTitle}>Cliente</Text>
        <Text>{order.customer?.person.name}</Text>
      </View>
      <View style={styles.reviewSection}>
        <Text style={styles.reviewTitle}>Itens</Text>
        {order.items?.map(item => (
          <Text key={item.product.id_product}>{item.quantity}x {item.product.name} - R$ {item.total_price.toFixed(2)}</Text>
        ))}
      </View>
      <View style={styles.reviewSection}>
        <Text style={styles.reviewTitle}>Pagamento e Frete</Text>
        <Text>Tipo de Frete: {order.shipping_type}</Text>
        <Text>Custo do Frete: R$ {order.shipping_cost?.toFixed(2)}</Text>
        <Text>Método de Pagamento: {order.payment_method}</Text>
        <Text>Prazo de Pagamento: {order.payment_term}</Text>
      </View>
      <View style={styles.reviewSection}>
        <Text style={styles.reviewTitle}>Total Geral: R$ {finalTotal.toFixed(2)}</Text>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Data de Entrega</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/AAAA"
          onChangeText={text => setOrder({ ...order, delivery_date: text })}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Observações</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          placeholder="Observações sobre o pedido..."
          onChangeText={text => setOrder({ ...order, observations: text })}
        />
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.finalizeButton} onPress={onFinalize}>
          <Text style={styles.buttonText}>Finalizar Pedido</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Step 5: Confirmation
const ConfirmationStep = ({ onReset }: { onReset: () => void }) => (
  <View style={[styles.stepContainer, { justifyContent: 'center', alignItems: 'center' }]}>
    <Text style={styles.stepTitle}>Pedido Realizado com Sucesso!</Text>
    <Text style={{ marginBottom: 20 }}>O pedido foi registrado.</Text>
    <TouchableOpacity style={styles.finalizeButton} onPress={onReset}>
      <Text style={styles.buttonText}>Criar Novo Pedido</Text>
    </TouchableOpacity>
  </View>
);


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 16, backgroundColor: '#ff8f00' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  headerSubtitle: { fontSize: 14, color: 'white' },
  stepContainer: { flex: 1, padding: 16 },
  stepTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  listItem: { backgroundColor: 'white', padding: 16, borderRadius: 8, marginBottom: 8, elevation: 1 },
  listItemTitle: { fontSize: 16, fontWeight: '500' },
  listItemSubtitle: { fontSize: 14, color: '#666' },
  productItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 8, borderRadius: 8, marginBottom: 8, elevation: 1 },
  quantityInput: { width: 60, height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, textAlign: 'center', marginLeft: 16 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderTopWidth: 1, borderColor: '#eee', backgroundColor: 'white' },
  backButton: { padding: 12, backgroundColor: '#ccc', borderRadius: 8 },
  nextButton: { padding: 12, backgroundColor: '#ffb300', borderRadius: 8 },
  finalizeButton: { padding: 12, backgroundColor: '#4caf50', borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  summary: { alignItems: 'center' },
  totalAmount: { fontWeight: 'bold' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 16, marginBottom: 8 },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16 },
  inputDisabled: {
    backgroundColor: '#f0f0f0',
    color: '#999',
  },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#eee', borderRadius: 20 },
  chipSelected: { backgroundColor: '#ffb300' },
  chipText: { fontWeight: '500' },
  chipTextSelected: { color: 'white' },
  reviewSection: { marginBottom: 16, backgroundColor: 'white', padding: 12, borderRadius: 8 },
  reviewTitle: { fontWeight: 'bold', marginBottom: 4 },
});
