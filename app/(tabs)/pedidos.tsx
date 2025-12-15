import React, { useEffect, useState } from 'react';
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
import { DateInput } from '../../components/DateInput';
import { useTheme } from '../../contexts/ThemeContext';
import { mockCustomers, mockProducts } from '../../database/mocks'; // Importando dados fictícios
import { saveOrder, updateOrder } from '../../services/order-storage.service';
import { Customer } from './types/customer';
import { Order, OrderItem } from './types/order';
import { Product } from './types/product';

type WizardStep = 'customer' | 'products' | 'shipping' | 'review' | 'confirmation';

import { useRoute } from '@react-navigation/native';

export default function PedidosScreen() {
  const { theme } = useTheme();
  const route = useRoute<any>();
  const [step, setStep] = useState<WizardStep>('customer');
  const [order, setOrder] = useState<Partial<Order>>({
    items: [],
    shipping_cost: 0,
    total_amount: 0,
  });

  // Se vier um pedido para editar, preenche o formulário
  useEffect(() => {
    if (route?.params?.orderToEdit) {
      setOrder(route.params.orderToEdit);
      setStep('customer');
    }
  }, [route?.params?.orderToEdit]);

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

  const handleFinalizeOrder = async () => {
    if (!order.customer || !order.items?.length || !order.payment_method || !order.delivery_date) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios antes de finalizar.");
      return;
    }
    let newOrder;
    let isEdit = !!order.id_order;
    if (isEdit) {
      // Atualiza campos editáveis e mantém id_order e created_at
      newOrder = {
        ...order,
        updated_at: new Date().toISOString(),
      };
    } else {
      newOrder = {
        ...order,
        id_order: Date.now(),
        seller_id: 1,
        products_value: order.total_amount || 0,
        discount_value: 0,
        status: 'Pendente',
        status_history: [],
        created_at: new Date().toISOString(),
      };
    }
    try {
      if (isEdit) {
        await updateOrder(newOrder);
      } else {
        await saveOrder(newOrder);
      }
      setStep('confirmation');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o pedido.');
    }
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
        return <CustomerStep theme={theme} onSelectCustomer={handleSelectCustomer} />;
      case 'products':
        return <ProductsStep theme={theme} order={order} onUpdateItem={handleUpdateItem} onNext={() => setStep('shipping')} onBack={() => setStep('customer')} />;
      case 'shipping':
        return <ShippingStep theme={theme} order={order} setOrder={setOrder} onNext={() => setStep('review')} onBack={() => setStep('products')} />;
      case 'review':
        return <ReviewStep theme={theme} order={order} setOrder={setOrder} onFinalize={handleFinalizeOrder} onBack={() => setStep('shipping')} />;
      case 'confirmation':
        return <ConfirmationStep theme={theme} onReset={resetOrder} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.primary} />
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Text style={[styles.headerTitle, { color: theme.buttonText }]}>Emissão de Pedido</Text>
        <Text style={[styles.headerSubtitle, { color: theme.buttonText }]}>Passo: {step.charAt(0).toUpperCase() + step.slice(1)}</Text>
      </View>
      {renderStep()}
    </SafeAreaView>
  );
}

// Step 1: Customer Selection
const CustomerStep = ({ theme, onSelectCustomer }: { theme: any, onSelectCustomer: (customer: Customer) => void }) => (
  <View style={[styles.stepContainer, { backgroundColor: theme.background }]}>
    <Text style={[styles.stepTitle, { color: theme.text }]}>Selecione o Cliente *</Text>
    <FlatList
      data={mockCustomers.filter(c => c.active)}
      keyExtractor={item => item.id_customer.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity style={[styles.listItem, { backgroundColor: theme.card }]} onPress={() => onSelectCustomer(item)}>
          <Text style={[styles.listItemTitle, { color: theme.text }]}>{item.person.name}</Text>
          <Text style={[styles.listItemSubtitle, { color: theme.textSecondary }]}>{item.person.cpf_cnpj}</Text>
        </TouchableOpacity>
      )}
    />
  </View>
);

// Step 2: Product Selection
const ProductsStep = ({ theme, order, onUpdateItem, onNext, onBack }: { theme: any, order: Partial<Order>, onUpdateItem: (product: Product, quantity: number) => void, onNext: () => void, onBack: () => void }) => {
  const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  
  return (
    <View style={[styles.stepContainer, { backgroundColor: theme.background }]}>
       <Text style={[styles.stepTitle, { color: theme.text }]}>Adicione os Produtos *</Text>
      <FlatList
        data={mockProducts.filter(p => p.active)}
        keyExtractor={item => item.id_product.toString()}
        renderItem={({ item }) => (
          <View style={[styles.productItem, { backgroundColor: theme.card }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.listItemTitle, { color: theme.text }]}>{item.name}</Text>
              <Text style={[styles.listItemSubtitle, { color: theme.textSecondary }]}>R$ {item.price.toFixed(2)}</Text>
            </View>
            <TextInput
              style={[styles.quantityInput, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
              keyboardType="numeric"
              placeholder="Qtd"
              placeholderTextColor={theme.textSecondary}
              onChangeText={text => onUpdateItem(item, Number(text))}
              defaultValue={order.items?.find(i => i.product.id_product === item.id_product)?.quantity.toString() || ''}
            />
          </View>
        )}
        ListFooterComponent={<View style={{ height: 80 }}/>}
      />
       <View style={[styles.footer, { backgroundColor: theme.card }]}>  
        <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.buttonSecondary, borderColor: theme.border }]} onPress={onBack}>
          <Text style={[styles.buttonText, { color: theme.background }]}>Voltar</Text>
        </TouchableOpacity>
        <View style={styles.summary}>
          <Text style={{ color: theme.text }}>Itens: {totalItems}</Text>
          <Text style={[styles.totalAmount, { color: theme.text }]}>Total: R$ {order.total_amount?.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={[styles.nextButton, { backgroundColor: theme.primary }]} onPress={onNext}>
          <Text style={[styles.buttonText, { color: theme.buttonText }]}>Avançar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Step 3: Shipping and Payment
const ShippingStep = ({ theme, order, setOrder, onNext, onBack }: { theme: any, order: Partial<Order>, setOrder: (order: Partial<Order>) => void, onNext: () => void, onBack: () => void }) => {
  const shippingTypes: Order['shipping_type'][] = ['CIF', 'FOB', 'RET'];
  const paymentMethodOptions = [
    { description: 'Cartão de Crédito', id_payment: 1, rate: 0, term_days: 0, active: true },
    { description: 'Boleto', id_payment: 2, rate: 0, term_days: 7, active: true },
    { description: 'PIX', id_payment: 3, rate: 0, term_days: 0, active: true },
    { description: 'Dinheiro', id_payment: 4, rate: 0, term_days: 0, active: true },
  ];
  const paymentTerms = ['À vista', '7/14/21', '10/15/20', '30/60/90'];
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<string>(order.payment_method?.description || '');
  const [selectedPaymentTerm, setSelectedPaymentTerm] = React.useState<string>(order.payment_method?.term_days ? `${order.payment_method.term_days} dias` : '');

  const handleSelectShippingType = (type: Order['shipping_type']) => {
    const newOrder = { ...order, shipping_type: type };
    if (type === 'RET') {
      newOrder.shipping_cost = 0;
    }
    setOrder(newOrder);
  };

  return (
    <ScrollView style={[styles.stepContainer, { backgroundColor: theme.background }]}>
      <Text style={[styles.stepTitle, { color: theme.text }]}>Frete e Pagamento</Text>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Tipo de Frete *</Text>
        <View style={styles.chipContainer}>
          {shippingTypes.map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.chip, 
                { backgroundColor: theme.inputBackground, borderColor: theme.border },
                order.shipping_type === type && { backgroundColor: theme.primary, borderColor: theme.primary }
              ]}
              onPress={() => handleSelectShippingType(type)}
            >
              <Text style={[
                styles.chipText, 
                { color: theme.text },
                order.shipping_type === type && { color: theme.buttonText }
              ]}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Custo do Frete</Text>
        <TextInput
          style={[
            styles.input, 
            { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text },
            order.shipping_type === 'RET' && { opacity: 0.5 }
          ]}
          keyboardType="numeric"
          placeholder="R$ 0,00"
          placeholderTextColor={theme.inputPlaceholder}
          value={order.shipping_cost?.toString()}
          onChangeText={text => setOrder({ ...order, shipping_cost: Number(text) })}
          editable={order.shipping_type !== 'RET'}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Método de Pagamento *</Text>
        <View style={styles.chipContainer}>
          {paymentMethodOptions.map(method => (
            <TouchableOpacity
              key={method.description}
              style={[
                styles.chip, 
                { backgroundColor: theme.inputBackground, borderColor: theme.border },
                selectedPaymentMethod === method.description && { backgroundColor: theme.primary, borderColor: theme.primary }
              ]}
              onPress={() => setSelectedPaymentMethod(method.description)}
            >
              <Text style={[
                styles.chipText, 
                { color: theme.text },
                selectedPaymentMethod === method.description && { color: theme.buttonText }
              ]}>{method.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Prazo de Pagamento *</Text>
        <View style={styles.chipContainer}>
          {paymentTerms.map(term => (
            <TouchableOpacity
              key={term}
              style={[
                styles.chip, 
                { backgroundColor: theme.inputBackground, borderColor: theme.border },
                selectedPaymentTerm === term && { backgroundColor: theme.primary, borderColor: theme.primary }
              ]}
              onPress={() => setSelectedPaymentTerm(term)}
            >
              <Text style={[
                styles.chipText, 
                { color: theme.text },
                selectedPaymentTerm === term && { color: theme.buttonText }
              ]}>{term}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.buttonSecondary, borderColor: theme.border }]} onPress={onBack}>
          <Text style={[styles.buttonText, { color: theme.background }]}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.nextButton, { backgroundColor: theme.primary }]} onPress={() => {
          const method = paymentMethodOptions.find(m => m.description === selectedPaymentMethod);
          if (!method) {
            Alert.alert('Erro', 'Selecione o método de pagamento.');
            return;
          }
          // Salva o prazo de pagamento selecionado (como string e dias)
          let term_days = 0;
          if (selectedPaymentTerm === 'À vista') term_days = 0;
          else if (selectedPaymentTerm === '7/14/21') term_days = 21;
          else if (selectedPaymentTerm === '10/15/20') term_days = 20;
          else if (selectedPaymentTerm === '30/60/90') term_days = 90;
          // Cria novo objeto payment_method com o prazo e label
          setOrder({ ...order, payment_method: { ...method, term_days, term_label: selectedPaymentTerm } });
          onNext();
        }}>
          <Text style={[styles.buttonText, { color: theme.buttonText }]}>Avançar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Step 4: Review
const ReviewStep = ({ theme, order, setOrder, onFinalize, onBack }: { theme: any, order: Partial<Order>, setOrder: (order: Partial<Order>) => void, onFinalize: () => void, onBack: () => void }) => {
  const finalTotal = (order.total_amount || 0) + (order.shipping_cost || 0);

  return (
    <ScrollView style={[styles.stepContainer, { backgroundColor: theme.background }]}>
      <Text style={[styles.stepTitle, { color: theme.text }]}>Revisão do Pedido</Text>
      <View style={styles.reviewSection}>
        <Text style={[styles.reviewTitle, { color: theme.text }]}>Cliente</Text>
        <Text style={{ color: theme.textSecondary }}>{order.customer?.person.name}</Text>
      </View>
      <View style={styles.reviewSection}>
        <Text style={[styles.reviewTitle, { color: theme.text }]}>Itens</Text>
        {order.items?.map(item => (
          <Text key={item.product.id_product} style={{ color: theme.textSecondary }}>{item.quantity}x {item.product.name} - R$ {item.total_price.toFixed(2)}</Text>
        ))}
      </View>
      <View style={styles.reviewSection}>
        <Text style={[styles.reviewTitle, { color: theme.text }]}>Pagamento e Frete</Text>
        <Text style={{ color: theme.textSecondary }}>Tipo de Frete: {order.shipping_type}</Text>
        <Text style={{ color: theme.textSecondary }}>Custo do Frete: R$ {order.shipping_cost?.toFixed(2)}</Text>
        <Text style={{ color: theme.textSecondary }}>Método de Pagamento: {order.payment_method?.description || 'Não informado'}</Text>
        <Text style={{ color: theme.textSecondary }}>Prazo de Pagamento: {order.payment_method?.term_label || 'Não informado'}</Text>
      </View>
      <View style={styles.reviewSection}>
        <Text style={[styles.reviewTitle, { color: theme.text }]}>Total Geral: R$ {finalTotal.toFixed(2)}</Text>
      </View>
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Data de Entrega</Text>
        <DateInput
          style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
          placeholder="DD/MM/AAAA"
          placeholderTextColor={theme.inputPlaceholder}
          value={order.delivery_date || ''}
          onChangeText={text => setOrder({ ...order, delivery_date: text })}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Observações</Text>
        <TextInput
          style={[styles.input, { height: 80, backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
          multiline
          placeholder="Observações sobre o pedido..."
          placeholderTextColor={theme.inputPlaceholder}
          onChangeText={text => setOrder({ ...order, observations: text })}
        />
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.buttonSecondary, borderColor: theme.border }]} onPress={onBack}>
          <Text style={[styles.buttonText, { color: theme.background }]}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.finalizeButton, { backgroundColor: theme.primary }]} onPress={onFinalize}>
          <Text style={[styles.buttonText, { color: theme.buttonText }]}>Finalizar Pedido</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Step 5: Confirmation
const ConfirmationStep = ({ theme, onReset }: { theme: any, onReset: () => void }) => (
  <View style={[styles.stepContainer, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
    <Text style={[styles.stepTitle, { color: theme.text }]}>Pedido Realizado com Sucesso!</Text>
    <Text style={{ marginBottom: 20, color: theme.textSecondary }}>O pedido foi registrado.</Text>
    <TouchableOpacity style={[styles.finalizeButton, { backgroundColor: theme.primary }]} onPress={onReset}>
      <Text style={[styles.buttonText, { color: theme.buttonText }]}>Criar Novo Pedido</Text>
    </TouchableOpacity>
  </View>
);


const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 14 },
  stepContainer: { flex: 1, padding: 16 },
  stepTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  listItem: { padding: 16, borderRadius: 8, marginBottom: 8, elevation: 1 },
  listItemTitle: { fontSize: 16, fontWeight: '500' },
  listItemSubtitle: { fontSize: 14 },
  productItem: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 8, marginBottom: 8, elevation: 1 },
  quantityInput: { width: 60, height: 40, borderWidth: 1, borderRadius: 8, textAlign: 'center', marginLeft: 16 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderTopWidth: 1 },
  backButton: { padding: 12, borderRadius: 8 },
  nextButton: { padding: 12, borderRadius: 8 },
  finalizeButton: { padding: 12, borderRadius: 8 },
  buttonText: { fontWeight: 'bold' },
  summary: { alignItems: 'center' },
  totalAmount: { fontWeight: 'bold' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16 },
  inputDisabled: {
    opacity: 0.5,
  },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  chipSelected: {},
  chipText: { fontWeight: '500' },
  chipTextSelected: {},
  reviewSection: { marginBottom: 16, padding: 12, borderRadius: 8 },
  reviewTitle: { fontWeight: 'bold', marginBottom: 4 },
});
