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
  useWindowDimensions,
  Alert,
  RefreshControl,
  Image,
} from 'react-native';
import { Customer, Contact, FilterType } from './types/customer';
import { CustomerService } from '../../services/customer.service';
import CreateCustomerModal from '../../components/CreateCustomerModal';
import EditCustomerModal from '../../components/EditCustomerModal';
import CustomerDetailsScreen from '../../components/CustomerDetailsScreen';
import DeleteCustomerModal from '../../components/DeleteCustomerModal';

export default function ClientesScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [filterActive, setFilterActive] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Estados dos modais
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsScreen, setShowDetailsScreen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  // Carrega clientes na inicialização
  useEffect(() => {
    loadCustomers();
  }, []);

  // Função para carregar clientes
  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await CustomerService.getAll();
      console.log('clientes.tsx - loadCustomers() - Clientes carregados:', data.length);
      console.log('clientes.tsx - loadCustomers() - IDs:', data.map(c => c.id_customer));
      setCustomers(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os clientes');
    } finally {
      setLoading(false);
    }
  };

  // Função para recarregar (pull to refresh)
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCustomers();
    setRefreshing(false);
  };

  // Função para filtrar clientes
  useEffect(() => {
    let filtered = customers;

    // Filtro por texto
    if (searchText.trim()) {
      filtered = filtered.filter(customer =>
        customer.person.name.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.person.cpf_cnpj.includes(searchText) ||
        customer.contacts.some(contact =>
          contact.value.toLowerCase().includes(searchText.toLowerCase())
        )
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

  // Funções de navegação
  const handleCustomerPress = (customer: Customer) => {
    setSelectedCustomer(customer);
    setSelectedCustomerId(customer.id_customer);
    setShowDetailsScreen(true);
  };

  const handleEditCustomer = (customer?: Customer) => {
    if (customer) {
      setSelectedCustomer(customer);
      setSelectedCustomerId(customer.id_customer);
    }
    setShowDetailsScreen(false);
    setShowEditModal(true);
  };

  const handleDeleteCustomer = (customer?: Customer) => {
    if (customer) {
      setSelectedCustomer(customer);
    }
    setShowDetailsScreen(false);
    setShowDeleteModal(true);
  };

  const handleSuccess = () => {
    loadCustomers(); // Recarrega a lista
    setSelectedCustomer(null);
    setSelectedCustomerId(null);
  };

  // Componente do Card do Cliente
  const CustomerCard = ({ item }: { item: Customer }) => (
    <TouchableOpacity
      style={[
        styles.customerCard,
        !item.active && styles.inactiveCard,
        isTablet && styles.tabletCard
      ]}
      onPress={() => handleCustomerPress(item)}
      onLongPress={() => {
        Alert.alert(
          'Opções',
          `O que deseja fazer com ${item.person.name}?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Visualizar', onPress: () => handleCustomerPress(item) },
            { text: 'Editar', onPress: () => handleEditCustomer(item) },
            { text: 'Excluir', style: 'destructive', onPress: () => handleDeleteCustomer(item) },
          ]
        );
      }}
    >
      <View style={styles.cardHeader}>
        {/* Foto do Cliente */}
        <View style={styles.avatarContainer}>
          {item.photo_uri ? (
            <Image source={{ uri: item.photo_uri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {item.person.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#2196F3']}
            tintColor="#2196F3"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? 'Carregando...' : 'Nenhum cliente encontrado'}
            </Text>
            <Text style={styles.emptySubtext}>
              {loading ? 'Por favor, aguarde' : 'Tente ajustar os filtros ou termo de busca'}
            </Text>
          </View>
        }
      />

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowCreateModal(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Modais e Telas */}
      <CreateCustomerModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleSuccess}
      />

      <EditCustomerModal
        visible={showEditModal}
        customerId={selectedCustomerId}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCustomerId(null);
          setSelectedCustomer(null);
        }}
        onSuccess={handleSuccess}
      />

      {showDetailsScreen && selectedCustomer && (
        <View style={StyleSheet.absoluteFillObject}>
          <CustomerDetailsScreen
            customerId={selectedCustomer.id_customer}
            onEdit={() => handleEditCustomer(selectedCustomer)}
            onDelete={() => handleDeleteCustomer(selectedCustomer)}
            onClose={() => {
              setShowDetailsScreen(false);
              setSelectedCustomer(null);
              setSelectedCustomerId(null);
            }}
          />
        </View>
      )}

      <DeleteCustomerModal
        visible={showDeleteModal}
        customer={selectedCustomer}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCustomer(null);
        }}
        onSuccess={handleSuccess}
      />
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
  // Avatar do cliente
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
