import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';
import CreateProductModal from '../../components/CreateProductModal';
import EditProductModal from '../../components/EditProductModal';
import { useTheme } from '../../contexts/ThemeContext';
import { ProductService } from '../../services/product.service';
import { FilterType, Product } from './types/product';

export default function ProdutosScreen() {
  const { theme } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [filterActive, setFilterActive] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Estados dos modais
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  // Carregar produtos ao montar componente
  useEffect(() => {
    loadProducts();
  }, []);

  // Função para carregar produtos
  const loadProducts = async () => {
    try {
      const loadedProducts = await ProductService.getAll();
      setProducts(loadedProducts);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os produtos');
    }
  };

  // Função para atualizar lista (pull to refresh)
  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

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
  const handleCreateProduct = async () => {
    await loadProducts();
    setCreateModalVisible(false);
  };

  const handleEditProduct = async () => {
    await loadProducts();
    setEditModalVisible(false);
    setDetailsModalVisible(false);
  };

  const handleDeleteProduct = async (hardDelete: boolean = false) => {
    if (!selectedProduct) return;

    try {
      if (hardDelete) {
        await ProductService.hardDelete(selectedProduct.id_product);
        Alert.alert('Sucesso', 'Produto excluído permanentemente!');
      } else {
        await ProductService.delete(selectedProduct.id_product);
        Alert.alert('Sucesso', 'Produto desativado com sucesso!');
      }

      await loadProducts();
      setDetailsModalVisible(false);
      setSelectedProduct(null);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir o produto');
    }
  };

  const handleToggleActive = async () => {
    if (!selectedProduct) return;

    try {
      const updatedProduct = { ...selectedProduct, active: !selectedProduct.active };
      await ProductService.update(selectedProduct.id_product, updatedProduct);

      await loadProducts();
      setSelectedProduct(updatedProduct);
      Alert.alert('Sucesso', `Produto ${updatedProduct.active ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o produto');
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

  const openDeleteConfirmation = () => {
    setDetailsModalVisible(false);

    Alert.alert(
      'Confirmar Exclusão',
      `Deseja excluir o produto "${selectedProduct?.name}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => setDetailsModalVisible(true)
        },
        {
          text: 'Desativar',
          style: 'default',
          onPress: () => handleDeleteProduct(false)
        },
        {
          text: 'Excluir Permanentemente',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Atenção!',
              'Esta ação não pode ser desfeita. Confirma a exclusão permanente?',
              [
                {
                  text: 'Cancelar',
                  style: 'cancel'
                },
                {
                  text: 'Sim, Excluir',
                  style: 'destructive',
                  onPress: () => handleDeleteProduct(true)
                }
              ]
            );
          }
        }
      ]
    );
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
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
        onSuccess={handleCreateProduct}
      />

      <EditProductModal
        visible={editModalVisible}
        product={selectedProduct}
        onClose={() => setEditModalVisible(false)}
        onSuccess={handleEditProduct}
      />

      {/* Details Modal */}
      <Modal
        visible={detailsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.detailsModal, { backgroundColor: theme.card }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={styles.detailsHeader}>
                <Text style={[styles.detailsTitle, { color: theme.text }]}>
                  Detalhes do Produto
                </Text>
                <TouchableOpacity onPress={() => setDetailsModalVisible(false)}>
                  <Text style={[styles.closeButton, { color: theme.primary }]}>✕</Text>
                </TouchableOpacity>
              </View>

              {selectedProduct && (
                <>
                  {/* Photo */}
                  {selectedProduct.photo_url && (
                    <View style={styles.detailsPhotoContainer}>
                      <Image
                        source={{ uri: selectedProduct.photo_url }}
                        style={styles.detailsPhoto}
                        resizeMode="cover"
                      />
                    </View>
                  )}

                  {/* Status Badge */}
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: selectedProduct.active ? '#4caf50' : '#f44336' }
                  ]}>
                    <Text style={styles.statusBadgeText}>
                      {selectedProduct.active ? 'ATIVO' : 'INATIVO'}
                    </Text>
                  </View>

                  {/* Info Sections */}
                  <View style={styles.detailsSection}>
                    <Text style={[styles.detailsLabel, { color: theme.textSecondary }]}>Nome</Text>
                    <Text style={[styles.detailsValue, { color: theme.text }]}>{selectedProduct.name}</Text>
                  </View>

                  {selectedProduct.description && (
                    <View style={styles.detailsSection}>
                      <Text style={[styles.detailsLabel, { color: theme.textSecondary }]}>Descrição</Text>
                      <Text style={[styles.detailsValue, { color: theme.text }]}>{selectedProduct.description}</Text>
                    </View>
                  )}

                  <View style={styles.detailsRow}>
                    <View style={[styles.detailsSection, { flex: 1 }]}>
                      <Text style={[styles.detailsLabel, { color: theme.textSecondary }]}>Categoria</Text>
                      <Text style={[styles.detailsValue, { color: theme.text }]}>{selectedProduct.category}</Text>
                    </View>
                    <View style={[styles.detailsSection, { flex: 1 }]}>
                      <Text style={[styles.detailsLabel, { color: theme.textSecondary }]}>Unidade</Text>
                      <Text style={[styles.detailsValue, { color: theme.text }]}>{selectedProduct.unit_measure}</Text>
                    </View>
                  </View>

                  <View style={styles.detailsRow}>
                    <View style={[styles.detailsSection, { flex: 1 }]}>
                      <Text style={[styles.detailsLabel, { color: theme.textSecondary }]}>Preço Custo</Text>
                      <Text style={[styles.detailsValue, { color: theme.text }]}>
                        {ProductService.formatCurrency(selectedProduct.price_cost)}
                      </Text>
                    </View>
                    <View style={[styles.detailsSection, { flex: 1 }]}>
                      <Text style={[styles.detailsLabel, { color: theme.textSecondary }]}>Preço Venda</Text>
                      <Text style={[styles.detailsValue, { color: theme.text }]}>
                        {ProductService.formatCurrency(selectedProduct.price_sale)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailsSection}>
                    <Text style={[styles.detailsLabel, { color: theme.textSecondary }]}>Estoque</Text>
                    <Text style={[styles.detailsValue, { color: theme.text }]}>
                      {selectedProduct.stock} {selectedProduct.unit_measure}
                    </Text>
                  </View>

                  {(selectedProduct.net_weight || selectedProduct.gross_weight) && (
                    <View style={styles.detailsRow}>
                      {selectedProduct.net_weight && (
                        <View style={[styles.detailsSection, { flex: 1 }]}>
                          <Text style={[styles.detailsLabel, { color: theme.textSecondary }]}>Peso Líquido</Text>
                          <Text style={[styles.detailsValue, { color: theme.text }]}>{selectedProduct.net_weight} kg</Text>
                        </View>
                      )}
                      {selectedProduct.gross_weight && (
                        <View style={[styles.detailsSection, { flex: 1 }]}>
                          <Text style={[styles.detailsLabel, { color: theme.textSecondary }]}>Peso Bruto</Text>
                          <Text style={[styles.detailsValue, { color: theme.text }]}>{selectedProduct.gross_weight} kg</Text>
                        </View>
                      )}
                    </View>
                  )}

                  {(selectedProduct.ncm || selectedProduct.cest) && (
                    <View style={styles.detailsRow}>
                      {selectedProduct.ncm && (
                        <View style={[styles.detailsSection, { flex: 1 }]}>
                          <Text style={[styles.detailsLabel, { color: theme.textSecondary }]}>NCM</Text>
                          <Text style={[styles.detailsValue, { color: theme.text }]}>{selectedProduct.ncm}</Text>
                        </View>
                      )}
                      {selectedProduct.cest && (
                        <View style={[styles.detailsSection, { flex: 1 }]}>
                          <Text style={[styles.detailsLabel, { color: theme.textSecondary }]}>CEST</Text>
                          <Text style={[styles.detailsValue, { color: theme.text }]}>{selectedProduct.cest}</Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Action Buttons */}
                  <View style={styles.detailsActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: '#3B82F6' }]}
                      onPress={openEdit}
                    >
                      <Text style={styles.actionButtonText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: selectedProduct.active ? '#f59e0b' : '#10b981' }]}
                      onPress={handleToggleActive}
                    >
                      <Text style={styles.actionButtonText}>
                        {selectedProduct.active ? 'Desativar' : 'Ativar'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: '#DC2626' }]}
                      onPress={openDeleteConfirmation}
                    >
                      <Text style={styles.actionButtonText}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  // Details Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  detailsModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 28,
    fontWeight: '300',
    paddingHorizontal: 8,
  },
  detailsPhotoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  detailsPhoto: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  statusBadge: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 20,
  },
  statusBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  detailsSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  detailsLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailsValue: {
    fontSize: 16,
  },
  detailsActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingTop: 24,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
