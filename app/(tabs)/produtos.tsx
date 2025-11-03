import React, { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';
import { FilterType, Product } from './types/product';

// simulando dados
const mockProducts: Product[] = [
  {
    id_product: 1,
    name: "Café Torrado Premium",
    price: 45.90,
    stock: 150,
    active: true,
    category: "Grãos"
  },
  {
    id_product: 2,
    name: "Azeite Extra Virgem",
    price: 28.50,
    stock: 80,
    active: true,
    category: "Mercearia"
  },
  {
    id_product: 3,
    name: "Queijo Minas Padrão",
    price: 62.00,
    stock: 0,
    active: false,
    category: "Laticínios"
  },
  {
    id_product: 4,
    name: "Doce de Leite Artesanal",
    price: 22.00,
    stock: 120,
    active: true,
    category: "Doces"
  },
  {
    id_product: 5,
    name: "Cachaça Envelhecida",
    price: 89.90,
    stock: 40,
    active: false,
    category: "Bebidas"
  }
];

export default function ProdutosScreen() {
  const [products] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [searchText, setSearchText] = useState<string>('');
  const [filterActive, setFilterActive] = useState<FilterType>('all');

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  // Função para filtrar produtos
  useEffect(() => {
    let filtered = products;

    // Filtro por texto
    if (searchText.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchText.toLowerCase()) ||
        product.category.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filtro por status
    if (filterActive !== 'all') {
      filtered = filtered.filter(product =>
        filterActive === 'active' ? product.active : !product.active
      );
    }

    setFilteredProducts(filtered);
  }, [searchText, filterActive, products]);

  // Função para formatar moeda
  const formatCurrency = (value: number): string => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  // Componente do Card do Produto
  const ProductCard = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={[
        styles.productCard,
        !item.active && styles.inactiveCard,
        isTablet && styles.tabletCard
      ]}
      onPress={() => console.log('Produto selecionado:', item.id_product)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTag}>
              {item.category}
            </Text>
          </View>
        </View>
        <View style={[
          styles.statusIndicator,
          item.active ? styles.activeStatus : styles.inactiveStatus
        ]} />
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.priceText}>{formatCurrency(item.price)}</Text>
        <Text style={[
          styles.stockText,
          item.stock === 0 && styles.outOfStockText
        ]}>
          Estoque: {item.stock > 0 ? item.stock : 'Esgotado'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou categoria..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {([
          { key: 'all' as FilterType, label: 'Todos', count: products.length },
          { key: 'active' as FilterType, label: 'Ativos', count: products.filter(p => p.active).length },
          { key: 'inactive' as FilterType, label: 'Inativos', count: products.filter(p => !p.active).length }
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

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id_product.toString()}
        renderItem={({ item }) => <ProductCard item={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        numColumns={isTablet ? 2 : 1}
        key={isTablet ? 'tablet' : 'phone'}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
            <Text style={styles.emptySubtext}>
              Tente ajustar os filtros ou termo de busca
            </Text>
          </View>
        }
      />

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => console.log('Adicionar novo produto')}
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
    backgroundColor: '#4CAF50',
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
  productCard: {
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
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
  },
  categoryTag: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
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
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  stockText: {
    fontSize: 14,
    color: '#666',
  },
  outOfStockText: {
    color: '#d32f2f',
    fontWeight: '500',
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
    backgroundColor: '#4CAF50',
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
