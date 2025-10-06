import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Customer, Contact } from './types/customer';

// Mock data simulando dados vindos do backend
const mockCustomers: Customer[] = [
  {
    id_customer: 1,
    person: {
      id_person: 1,
      name: "Diogo Silva",
      person_type: "F",
      cpf_cnpj: "123.456.789-00",
      active: true
    },
    active: true,
    last_purchase: null,
    contacts: [
      { contact_type: "E", value: "diogo@hotmail.com.br" }
    ]
  }
];

export default function ClientesScreen() {
  const [customers] = useState<Customer[]>(mockCustomers);

  // Função para formatar data
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Função para obter primeiro contato por tipo
  const getContact = (contacts: Contact[], type: 'E' | 'T'): string => {
    const contact = contacts?.find((c: Contact) => c.contact_type === type);
    return contact?.value || 'Não informado';
  };

  // Componente do Card do Cliente
  const CustomerCard = ({ item }: { item: Customer }) => (
    <TouchableOpacity
      style={[
        styles.customerCard,
        !item.active && styles.inactiveCard
      ]}
      onPress={() => console.log('Cliente selecionado:', item.id_customer)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{item.person.name}</Text>
          <View style={styles.typeContainer}>
            <Text style={[
              styles.typeTag,
              item.person.person_type === 'F' ? styles.physicalTag : styles.legalTag
            ]}>
              {item.person.person_type === 'F' ? 'Pessoa Física' : 'Pessoa Jurídica'}
            </Text>
          </View>
        </View>
        <View style={[
          styles.statusIndicator,
          item.active ? styles.activeStatus : styles.inactiveStatus
        ]} />
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.documentText}>{item.person.cpf_cnpj}</Text>
        <Text style={styles.lastPurchaseText}>
          Última compra: {formatDate(item.last_purchase)}
        </Text>

        <View style={styles.contactsContainer}>
          <Text style={styles.contactText}>
            {getContact(item.contacts, 'E')}
          </Text>
          <Text style={styles.contactText}>
            {getContact(item.contacts, 'T')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />

      {/* Customer List */}
      <FlatList
        data={customers}
        keyExtractor={(item) => item.id_customer.toString()}
        renderItem={({ item }) => <CustomerCard item={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => console.log('Adicionar novo cliente')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  customerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  inactiveCard: {
    opacity: 0.7,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 8,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  typeContainer: {
    alignSelf: 'flex-start',
  },
  typeTag: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  physicalTag: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
  },
  legalTag: {
    backgroundColor: '#f3e5f5',
    color: '#7b1fa2',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  activeStatus: {
    backgroundColor: '#4caf50',
  },
  inactiveStatus: {
    backgroundColor: '#f44336',
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  documentText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
    marginBottom: 6,
  },
  lastPurchaseText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  contactsContainer: {
    gap: 4,
  },
  contactText: {
    fontSize: 14,
    color: '#555',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#2196F3',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
