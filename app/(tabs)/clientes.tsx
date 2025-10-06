import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  useWindowDimensions
} from 'react-native';
import { Customer, Contact, FilterType } from './types/customer';

// simulando dados
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
  },
  {
    id_customer: 2,
    person: {
      id_person: 2,
      name: "Cooxupe",
      person_type: "J",
      cpf_cnpj: "12.345.678/0001-90",
      active: true
    },
    active: true,
    last_purchase: "2024-10-01T14:20:00Z",
    contacts: [
      { contact_type: "E", value: "contato@cooxupe.com.br" },
      { contact_type: "T", value: "(11) 3333-5678" }
    ]
  },
  {
    id_customer: 3,
    person: {
      id_person: 3,
      name: "Leor Gabriel",
      person_type: "F",
      cpf_cnpj: "987.654.321-00",
      active: false
    },
    active: false,
    last_purchase: "2024-08-20T16:45:00Z",
    contacts: [
      { contact_type: "E", value: "leor.gabriel@gmail.com" },
      { contact_type: "T", value: "(11) 88888-9999" }
    ]
  }
];

export default function ClientesScreen() {
  const [customers] = useState<Customer[]>(mockCustomers);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(mockCustomers);
  const [searchText, setSearchText] = useState<string>('');
  const [filterActive, setFilterActive] = useState<FilterType>('all');

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  // Função para filtrar clientes
  useEffect(() => {
    let filtered = customers;

    // Filtro por texto
    if (searchText.trim()) {
      filtered = filtered.filter(customer =>
        customer.person.name.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.person.cpf_cnpj.includes(searchText)
      );
    }

    // Filtro por status
    if (filterActive !== 'all') {
      filtered = filtered.filter(customer =>
        filterActive === 'active' ? customer.active : !customer.active
      );
    }

    setFilteredCustomers(filtered);
  }, [searchText, filterActive, customers]);

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
        !item.active && styles.inactiveCard,
        isTablet && styles.tabletCard
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

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou documento..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {([
          { key: 'all' as FilterType, label: 'Todos', count: customers.length },
          { key: 'active' as FilterType, label: 'Ativos', count: customers.filter(c => c.active).length },
          { key: 'inactive' as FilterType, label: 'Inativos', count: customers.filter(c => !c.active).length }
        ]).map(filter => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              filterActive === filter.key && styles.activeFilterButton
            ]}
            onPress={() => setFilterActive(filter.key)}
          >
            <Text style={[
              styles.filterButtonText,
              filterActive === filter.key && styles.activeFilterButtonText
            ]}>
              {filter.label} ({filter.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Customer List */}
      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.id_customer.toString()}
        renderItem={({ item }) => <CustomerCard item={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        numColumns={isTablet ? 2 : 1}
        key={isTablet ? 'tablet' : 'phone'} // ajuste responsividade
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum cliente encontrado</Text>
            <Text style={styles.emptySubtext}>
              Tente ajustar os filtros ou termo de busca
            </Text>
          </View>
        }
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
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 8,
    backgroundColor: 'white',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: '#2196F3',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeFilterButtonText: {
    color: 'white',
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
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
  tabletCard: {
    flex: 1,
    marginHorizontal: 6,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
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
