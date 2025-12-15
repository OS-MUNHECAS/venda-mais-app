import React from 'react';
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Customer } from '../app/(tabs)/types/customer';
import { useTheme } from '../contexts/ThemeContext';
import { CustomerService } from '../services/customer.service';

interface Props {
    visible: boolean;
    customer: Customer | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function DeleteCustomerModal({ visible, customer, onClose, onSuccess }: Props) {
    const { theme } = useTheme();
    const [loading, setLoading] = React.useState(false);

    const handleSoftDelete = async () => {
        if (!customer) return;

        try {
            setLoading(true);
            await CustomerService.delete(customer.id_customer);

            Alert.alert('Cliente Desativado', 'O cliente foi desativado com sucesso.', [
                {
                    text: 'Continuar', onPress: () => {
                        onSuccess();
                        onClose();
                    }
                }
            ]);
        } catch (error) {
            Alert.alert('Erro na Operação', error instanceof Error ? error.message : 'Não foi possível desativar o cliente.');
        } finally {
            setLoading(false);
        }
    };

    const handleHardDelete = async () => {
        if (!customer) return;

        Alert.alert(
            'Confirmação',
            'Tem certeza que deseja excluir permanentemente este cliente? Esta ação não pode ser desfeita.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await CustomerService.hardDelete(customer.id_customer);

                            Alert.alert('Cliente Excluído', 'O cliente foi excluído permanentemente.', [
                                {
                                    text: 'Continuar', onPress: () => {
                                        onSuccess();
                                        onClose();
                                    }
                                }
                            ]);
                        } catch (error) {
                            Alert.alert('Erro na Exclusão', error instanceof Error ? error.message : 'Não foi possível excluir o cliente.');
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    if (!customer) return null;

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: theme.card }]}>
                    <Text style={[styles.title, { color: theme.text }]}>Excluir Cliente</Text>

                    <View style={[styles.customerInfo, { backgroundColor: theme.background }]}>
                        <Text style={[styles.customerName, { color: theme.text }]}>{customer.person.name}</Text>
                        <Text style={[styles.customerDocument, { color: theme.textSecondary }]}>{customer.person.cpf_cnpj}</Text>
                    </View>

                    <Text style={[styles.description, { color: theme.textSecondary }]}>
                        Escolha como você deseja proceder com este cliente:
                    </Text>

                    <View style={styles.optionsContainer}>
                        <TouchableOpacity
                            style={[styles.optionButton, styles.softDeleteButton, { borderColor: theme.warning }]}
                            onPress={handleSoftDelete}
                            disabled={loading}
                        >
                            <Text style={[styles.optionTitle, { color: theme.text }]}>Desativar Cliente</Text>
                            <Text style={[styles.optionDescription, { color: theme.textSecondary }]}>
                                O cliente ficará inativo, mas os dados serão mantidos.
                                Pode ser reativado posteriormente.
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.optionButton, styles.hardDeleteButton, { borderColor: theme.error }]}
                            onPress={handleHardDelete}
                            disabled={loading}
                        >
                            <Text style={[styles.optionTitle, styles.destructiveText, { color: theme.error }]}>Excluir Permanentemente</Text>
                            <Text style={[styles.optionDescription, styles.destructiveText, { color: theme.error }]}>
                                Remove todos os dados do cliente permanentemente.
                                Esta ação não pode ser desfeita.
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton, { backgroundColor: theme.background, borderColor: theme.border }]}
                            onPress={onClose}
                            disabled={loading}
                        >
                            <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>Cancelar</Text>
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
        borderRadius: 12,
        padding: 20,
        width: '100%',
        maxWidth: 400,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    customerInfo: {
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    customerName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    customerDocument: {
        fontSize: 14,
        fontFamily: 'monospace',
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
    optionsContainer: {
        marginBottom: 20,
    },
    optionButton: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
    },
    softDeleteButton: {
        backgroundColor: '#fff3e0',
        borderColor: '#ff9800',
    },
    hardDeleteButton: {
        backgroundColor: '#ffebee',
        borderColor: '#f44336',
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    optionDescription: {
        fontSize: 12,
        lineHeight: 16,
    },
    destructiveText: {},
    footer: {
        alignItems: 'center',
    },
    button: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 120,
        alignItems: 'center',
    },
    cancelButton: {
        borderWidth: 1,
    },
    cancelButtonText: {
        fontWeight: '500',
    },
});