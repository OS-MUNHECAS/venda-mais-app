import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ProductFormData } from '../app/(tabs)/types/product';
import { useTheme } from '../contexts/ThemeContext';
import { ProductService } from '../services/product.service';
import PhotoSelector from './PhotoSelector';

interface CreateProductModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const categories = [
  'Grãos',
  'Mercearia',
  'Laticínios',
  'Doces',
  'Bebidas',
  'Carnes',
  'Frutas',
  'Verduras',
  'Outros'
];

const unitMeasures = ['UN', 'KG', 'LT', 'MT', 'CX', 'PCT'];

export default function CreateProductModal({ visible, onClose, onSuccess }: CreateProductModalProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [photoUri, setPhotoUri] = useState('');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priceCost, setPriceCost] = useState('');
  const [priceSale, setPriceSale] = useState('');
  const [stock, setStock] = useState('');
  const [netWeight, setNetWeight] = useState('');
  const [grossWeight, setGrossWeight] = useState('');
  const [minStock, setMinStock] = useState('');
  const [maxStock, setMaxStock] = useState('');
  const [unitMeasure, setUnitMeasure] = useState('UN');
  const [ncm, setNcm] = useState('');
  const [cest, setCest] = useState('');
  const [defaultDiscount, setDefaultDiscount] = useState('');

  const resetForm = () => {
    setName('');
    setDescription('');
    setCategory('');
    setPriceCost('');
    setPriceSale('');
    setStock('');
    setNetWeight('');
    setGrossWeight('');
    setMinStock('');
    setMaxStock('');
    setUnitMeasure('UN');
    setNcm('');
    setCest('');
    setDefaultDiscount('');
    setPhotoUri('');
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      if (!name.trim()) {
        Alert.alert('Atenção', 'O nome do produto é obrigatório.');
        return;
      }

      if (!category) {
        Alert.alert('Atenção', 'A categoria é obrigatória.');
        return;
      }

      if (!priceSale) {
        Alert.alert('Atenção', 'O preço de venda é obrigatório.');
        return;
      }

      const productData: ProductFormData = {
        name: name.trim(),
        description: description.trim() || undefined,
        category,
        price_cost: parseFloat(priceCost) || 0,
        price_sale: parseFloat(priceSale),
        stock: parseFloat(stock) || 0,
        net_weight: netWeight ? parseFloat(netWeight) : undefined,
        gross_weight: grossWeight ? parseFloat(grossWeight) : undefined,
        min_stock: minStock ? parseFloat(minStock) : undefined,
        max_stock: maxStock ? parseFloat(maxStock) : undefined,
        unit_measure: unitMeasure,
        ncm: ncm.trim() || undefined,
        cest: cest.trim() || undefined,
        default_discount: defaultDiscount ? parseFloat(defaultDiscount) : undefined,
        photo_url: photoUri || undefined,
        active: true,
      };

      await ProductService.create(productData);

      Alert.alert('Produto Cadastrado', 'O produto foi cadastrado com sucesso.', [
        {
          text: 'Continuar',
          onPress: () => {
            resetForm();
            onSuccess();
            onClose();
          }
        }
      ]);
    } catch (error) {
      Alert.alert('Erro no Cadastro', error instanceof Error ? error.message : 'Não foi possível cadastrar o produto.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.primary, borderBottomColor: theme.border }]}>
          <Text style={[styles.headerTitle, { color: theme.buttonText }]}>Novo Produto</Text>
          <TouchableOpacity onPress={handleClose}>
            <Text style={[styles.closeButton, { color: theme.buttonText }]}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.photoSection}>
            <PhotoSelector
              photoUri={photoUri}
              onPhotoSelected={setPhotoUri}
              onPhotoRemoved={() => setPhotoUri('')}
            />
          </View>

          {/* Nome do Produto */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Nome do Produto *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
              placeholder="Ex: Café Torrado Premium"
              placeholderTextColor={theme.inputPlaceholder}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Descrição */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
              placeholder="Descrição detalhada do produto..."
              placeholderTextColor={theme.inputPlaceholder}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Categoria */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Categoria *</Text>
            <View style={styles.chipContainer}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.chip,
                    { backgroundColor: theme.inputBackground, borderColor: theme.border },
                    category === cat && { backgroundColor: theme.primary, borderColor: theme.primary }
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[
                    styles.chipText,
                    { color: theme.text },
                    category === cat && { color: theme.buttonText }
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preços */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={[styles.label, { color: theme.text }]}>Preço de Custo</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
                placeholder="0.00"
                placeholderTextColor={theme.inputPlaceholder}
                value={priceCost}
                onChangeText={setPriceCost}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={[styles.label, { color: theme.text }]}>Preço de Venda *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
                placeholder="0.00"
                placeholderTextColor={theme.inputPlaceholder}
                value={priceSale}
                onChangeText={setPriceSale}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {/* Estoque */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={[styles.label, { color: theme.text }]}>Estoque Atual</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
                placeholder="0"
                placeholderTextColor={theme.inputPlaceholder}
                value={stock}
                onChangeText={setStock}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={[styles.label, { color: theme.text }]}>Unidade de Medida *</Text>
              <View style={styles.chipContainer}>
                {unitMeasures.map(unit => (
                  <TouchableOpacity
                    key={unit}
                    style={[
                      styles.chipSmall,
                      { backgroundColor: theme.inputBackground, borderColor: theme.border },
                      unitMeasure === unit && { backgroundColor: theme.primary, borderColor: theme.primary }
                    ]}
                    onPress={() => setUnitMeasure(unit)}
                  >
                    <Text style={[
                      styles.chipText,
                      { color: theme.text },
                      unitMeasure === unit && { color: theme.buttonText }
                    ]}>
                      {unit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Estoque Mínimo e Máximo */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={[styles.label, { color: theme.text }]}>Estoque Mínimo</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
                placeholder="0"
                placeholderTextColor={theme.inputPlaceholder}
                value={minStock}
                onChangeText={setMinStock}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={[styles.label, { color: theme.text }]}>Estoque Máximo</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
                placeholder="0"
                placeholderTextColor={theme.inputPlaceholder}
                value={maxStock}
                onChangeText={setMaxStock}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {/* Pesos */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={[styles.label, { color: theme.text }]}>Peso Líquido (kg)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
                placeholder="0.000"
                placeholderTextColor={theme.inputPlaceholder}
                value={netWeight}
                onChangeText={setNetWeight}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={[styles.label, { color: theme.text }]}>Peso Bruto (kg)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
                placeholder="0.000"
                placeholderTextColor={theme.inputPlaceholder}
                value={grossWeight}
                onChangeText={setGrossWeight}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {/* NCM e CEST */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={[styles.label, { color: theme.text }]}>NCM</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
                placeholder="00000000"
                placeholderTextColor={theme.inputPlaceholder}
                value={ncm}
                onChangeText={setNcm}
                keyboardType="number-pad"
                maxLength={8}
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={[styles.label, { color: theme.text }]}>CEST</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
                placeholder="0000000"
                placeholderTextColor={theme.inputPlaceholder}
                value={cest}
                onChangeText={setCest}
                keyboardType="number-pad"
                maxLength={7}
              />
            </View>
          </View>

          {/* Desconto Padrão */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Desconto Padrão (%)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
              placeholder="0"
              placeholderTextColor={theme.inputPlaceholder}
              value={defaultDiscount}
              onChangeText={setDefaultDiscount}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: theme.buttonSecondary, borderColor: theme.border }]}
            onPress={handleClose}
            disabled={loading}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: '#3B82F6' }]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
              {loading ? 'Salvando...' : 'Cadastrar'}
            </Text>
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
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  photoSection: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipSmall: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
