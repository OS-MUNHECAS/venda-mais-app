import React, { useEffect, useState } from 'react';
import {
    Alert,
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
import CreateProductModal from '../../components/CreateProductModal';
import DeleteProductModal from '../../components/DeleteProductModal';
import EditProductModal from '../../components/EditProductModal';
import ProductDetailsScreen from '../../components/ProductDetailsScreen';
import { useTheme } from '../../contexts/ThemeContext';
import { FilterType, Product } from './types/product';

// simulando dados com novo formato
const mockProducts: Product[] = [
  {
    id_product: 1,
    name: "Café Torrado Premium",
    description: "Café especial 100% arábica torrado em pequenos lotes",
    category: "Grãos",
    price_cost: 30.00,
    price_sale: 45.90,
    stock: 150,
    net_weight: 0.5,
    gross_weight: 0.6,
    min_stock: 20,
    max_stock: 300,
    unit_measure: "KG",
    ncm: "09011190",
    cest: "1700100",
    default_discount: 5,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id_product: 2,
    name: "Azeite Extra Virgem",
    description: "Azeite português de primeira prensagem a frio",
    category: "Mercearia",
    price_cost: 18.00,
    price_sale: 28.50,
    stock: 80,
    net_weight: 0.5,
    gross_weight: 0.8,
    unit_measure: "LT",
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id_product: 3,
    name: "Queijo Minas Padrão",
    category: "Laticínios",
    price_cost: 45.00,
    price_sale: 62.00,
    stock: 0,
    unit_measure: "KG",
    active: false,
    created_at: new Date().toISOString(),
  },
  {
    id_product: 4,
    name: "Doce de Leite Artesanal",
    category: "Doces",
    price_cost: 12.00,
    price_sale: 22.00,
    stock: 120,
    unit_measure: "KG",
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id_product: 5,
    name: "Cachaça Envelhecida",
    description: "Cachaça envelhecida em barris de carvalho por 3 anos",
    category: "Bebidas",
    price_cost: 60.00,
    price_sale: 89.90,
    stock: 40,
    unit_measure: "LT",
    ncm: "22089000",
    active: false,
    created_at: new Date().toISOString(),
  }
];

export default function ProdutosScreen() {
  const { theme } = useTheme();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [searchText, setSearchText] = useState<string>('');
  const [filterActive, setFilterActive] = useState<FilterType>('all');

  // Estados dos modais
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  // Funções CRUD
  const handleCreateProduct = (newProduct: Product) => {
    setProducts([...products, newProduct]);
    Alert.alert('Sucesso', 'Produto criado com sucesso!');
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => 
      p.id_product === updatedProduct.id_product ? updatedProduct : p
    ));
    setEditModalVisible(false);
    setDetailsModalVisible(false);
    Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
  };

  const handleDeleteProduct = () => {
    if (selectedProduct) {
      setProducts(products.filter(p => p.id_product !== selectedProduct.id_product));
      setDeleteModalVisible(false);
      setDetailsModalVisible(false);
      Alert.alert('Sucesso', 'Produto excluído com sucesso!');
    }
  };

  const handleToggleActive = () => {
    if (selectedProduct) {
      const updatedProduct = { ...selectedProduct, active: !selectedProduct.active };
      setProducts(products.map(p => 
        p.id_product === updatedProduct.id_product ? updatedProduct : p
      ));
      setSelectedProduct(updatedProduct);
      Alert.alert('Sucesso', `Produto ${updatedProduct.active ? 'ativado' : 'desativado'} com sucesso!`);
    }
  };

  const openDetails = (product: Product) => {
    setSelectedProduct(product);
    setDetailsModalVisible(true);
  };

  const openEdit = () => {
    setDetailsModalVisible(false);
    setEditModalVisible(true);
  };

  const openDelete = () => {
    setDetailsModalVisible(false);
    setDeleteModalVisible(true);
  };

  // Componente do Card do Produto
  const ProductCard = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={[
        styles.productCard,
        { backgroundColor: theme.card },
        !item.active && styles.inactiveCard,
        isTablet && styles.tabletCard
      ]}
      onPress={() => openDetails(item)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: theme.text }]}>{item.name}</Text>
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
        <Text style={[styles.priceText, { color: theme.text }]}>{formatCurrency(item.price_sale)}</Text>
        <Text style={[
          styles.stockText,
          { color: theme.textSecondary },
          item.stock === 0 && styles.outOfStockText
        ]}>
          Estoque: {item.stock > 0 ? `${item.stock} ${item.unit_measure}` : 'Esgotado'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.primary} />

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
          placeholder="Buscar por nome ou categoria..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={theme.textSecondary}
        />
      </View>

      {/* Filter Buttons */}
      <View style={[styles.filterContainer, { backgroundColor: theme.card }]}>
        {([
          { key: 'all' as FilterType, label: 'Todos', count: products.length },
          { key: 'active' as FilterType, label: 'Ativos', count: products.filter(p => p.active).length },
          { key: 'inactive' as FilterType, label: 'Inativos', count: products.filter(p => !p.active).length }
        ]).map(filter => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              { backgroundColor: theme.background },
              filterActive === filter.key && { backgroundColor: theme.primary }
            ]}
            onPress={() => setFilterActive(filter.key)}
          >
            <Text style={[
              styles.filterButtonText,
              { color: theme.textSecondary },
              filterActive === filter.key && { color: theme.buttonText }
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
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Nenhum produto encontrado</Text>
            <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
              Tente ajustar os filtros ou termo de busca
            </Text>
          </View>
        }
      />

      {/* Add Button */}
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.primary }]}
        onPress={() => setCreateModalVisible(true)}
      >
        <Text style={[styles.addButtonText, { color: theme.buttonText }]}>+</Text>
      </TouchableOpacity>

      {/* Modals */}
      <CreateProductModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSave={handleCreateProduct}
      />

      <EditProductModal
        visible={editModalVisible}
        product={selectedProduct}
        onClose={() => setEditModalVisible(false)}
        onSave={handleEditProduct}
      />

      <DeleteProductModal
        visible={deleteModalVisible}
        product={selectedProduct}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteProduct}
      />

      <ProductDetailsScreen
        visible={detailsModalVisible}
        product={selectedProduct}
        onClose={() => setDetailsModalVisible(false)}
        onEdit={openEdit}
        onDelete={openDelete}
        onToggleActive={handleToggleActive}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 8,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeFilterButton: {},
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterButtonText: {},
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  productCard: {
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
    marginBottom: 6,
  },
  stockText: {
    fontSize: 14,
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
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
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
  },
});
