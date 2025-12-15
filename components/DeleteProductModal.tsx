import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Product } from '../app/(tabs)/types/product';
import { useTheme } from '../contexts/ThemeContext';

interface DeleteProductModalProps {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteProductModal({ visible, product, onClose, onConfirm }: DeleteProductModalProps) {
  const { theme } = useTheme();

  if (!product) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>Confirmar Exclusão</Text>
          <Text style={[styles.message, { color: theme.textSecondary }]}>
            Tem certeza que deseja excluir o produto{'\n'}
            <Text style={{ fontWeight: 'bold', color: theme.text }}>{product.name}</Text>?
          </Text>
          <Text style={[styles.warning, { color: theme.error }]}>
            Esta ação não pode ser desfeita.
          </Text>
          
          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.buttonSecondary, borderColor: theme.border, borderWidth: 1 }]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: theme.background }]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.error }]}
              onPress={onConfirm}
            >
              <Text style={[styles.buttonText, { color: theme.buttonText }]}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 24,
  },
  warning: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
