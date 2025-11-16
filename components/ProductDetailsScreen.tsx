import React from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Product } from '../app/(tabs)/types/product';
import { useTheme } from '../contexts/ThemeContext';

interface ProductDetailsScreenProps {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}

export default function ProductDetailsScreen({
  visible,
  product,
  onClose,
  onEdit,
  onDelete,
  onToggleActive,
}: ProductDetailsScreenProps) {
  const { theme } = useTheme();

  if (!product) return null;

  const formatCurrency = (value: number): string => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const InfoRow = ({ label, value }: { label: string; value: string | undefined }) => {
    if (!value && value !== 0) return null;
    
    return (
      <View style={[styles.infoRow, { backgroundColor: theme.inputBackground }]}>
        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.primary }]}>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.closeButton, { color: theme.buttonText }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.buttonText }]}>Detalhes do Produto</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content}>
          {/* Foto do Produto */}
          {product.photo_url && (
            <View style={styles.photoSection}>
              <Image source={{ uri: product.photo_url }} style={styles.photo} />
            </View>
          )}

          {/* Nome e Categoria */}
          <View style={[styles.section, { backgroundColor: theme.card }]}>
            <Text style={[styles.productName, { color: theme.text }]}>{product.name}</Text>
            <View style={[styles.categoryBadge, { backgroundColor: theme.primary }]}>
              <Text style={[styles.categoryText, { color: theme.buttonText }]}>{product.category}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: product.active ? theme.success : theme.error }]}>
              <Text style={[styles.statusText, { color: theme.buttonText }]}>
                {product.active ? 'Ativo' : 'Inativo'}
              </Text>
            </View>
          </View>

          {/* Descrição */}
          {product.description && (
            <View style={[styles.section, { backgroundColor: theme.card }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Descrição</Text>
              <Text style={[styles.description, { color: theme.textSecondary }]}>{product.description}</Text>
            </View>
          )}

          {/* Informações de Preço */}
          <View style={[styles.section, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Preços</Text>
            <InfoRow label="Preço de Custo" value={formatCurrency(product.price_cost || 0)} />
            <InfoRow label="Preço de Venda" value={formatCurrency(product.price_sale)} />
            {product.default_discount !== undefined && product.default_discount > 0 && (
              <InfoRow label="Desconto Padrão" value={`${product.default_discount}%`} />
            )}
          </View>

          {/* Informações de Estoque */}
          <View style={[styles.section, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Estoque</Text>
            <InfoRow label="Estoque Atual" value={`${product.stock} ${product.unit_measure}`} />
            <InfoRow label="Unidade de Medida" value={product.unit_measure} />
            {product.min_stock !== undefined && (
              <InfoRow label="Estoque Mínimo" value={`${product.min_stock} ${product.unit_measure}`} />
            )}
            {product.max_stock !== undefined && (
              <InfoRow label="Estoque Máximo" value={`${product.max_stock} ${product.unit_measure}`} />
            )}
          </View>

          {/* Informações de Peso */}
          {(product.net_weight || product.gross_weight) && (
            <View style={[styles.section, { backgroundColor: theme.card }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Pesos</Text>
              {product.net_weight && (
                <InfoRow label="Peso Líquido" value={`${product.net_weight} kg`} />
              )}
              {product.gross_weight && (
                <InfoRow label="Peso Bruto" value={`${product.gross_weight} kg`} />
              )}
            </View>
          )}

          {/* Informações Fiscais */}
          {(product.ncm || product.cest) && (
            <View style={[styles.section, { backgroundColor: theme.card }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Informações Fiscais</Text>
              {product.ncm && <InfoRow label="NCM" value={product.ncm} />}
              {product.cest && <InfoRow label="CEST" value={product.cest} />}
            </View>
          )}

          {/* Datas */}
          <View style={[styles.section, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Informações do Sistema</Text>
            {product.created_at && (
              <InfoRow
                label="Criado em"
                value={new Date(product.created_at).toLocaleDateString('pt-BR')}
              />
            )}
            {product.updated_at && (
              <InfoRow
                label="Última atualização"
                value={new Date(product.updated_at).toLocaleDateString('pt-BR')}
              />
            )}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Botões de Ação */}
        <View style={[styles.footer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: product.active ? theme.warning : theme.success }]}
            onPress={onToggleActive}
          >
            <Text style={[styles.actionButtonText, { color: theme.buttonText }]}>
              {product.active ? 'Desativar' : 'Ativar'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.primary }]}
            onPress={onEdit}
          >
            <Text style={[styles.actionButtonText, { color: theme.buttonText }]}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.error }]}
            onPress={onDelete}
          >
            <Text style={[styles.actionButtonText, { color: theme.buttonText }]}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
  },
  closeButton: {
    fontSize: 32,
    fontWeight: 'bold',
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  photoSection: {
    alignItems: 'center',
    padding: 24,
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  section: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  actionButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
