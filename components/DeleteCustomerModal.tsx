import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    Alert,
    StyleSheet,
} from 'react-native';
import { Customer } from '../app/(tabs)/types/customer';
import { CustomerService } from '../services/customer.service';

interface Props {
    visible: boolean;
    customer: Customer | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function DeleteCustomerModal({ visible, customer, onClose, onSuccess }: Props) {
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
                <View style={styles.container}>
                    <Text style={styles.title}>Excluir Cliente</Text>

                    <View style={styles.customerInfo}>
                        <Text style={styles.customerName}>{customer.person.name}</Text>
                        <Text style={styles.customerDocument}>{customer.person.cpf_cnpj}</Text>
                    </View>

                    <Text style={styles.description}>
                        Escolha como você deseja proceder com este cliente:
                    </Text>

                    <View style={styles.optionsContainer}>
                        <TouchableOpacity
                            style={[styles.optionButton, styles.softDeleteButton]}
                            onPress={handleSoftDelete}
                            disabled={loading}
                        >
                            <Text style={styles.optionTitle}>Desativar Cliente</Text>
                            <Text style={styles.optionDescription}>
                                O cliente ficará inativo, mas os dados serão mantidos.
                                Pode ser reativado posteriormente.
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.optionButton, styles.hardDeleteButton]}
                            onPress={handleHardDelete}
                            disabled={loading}
                        >
                            <Text style={[styles.optionTitle, styles.destructiveText]}>Excluir Permanentemente</Text>
                            <Text style={[styles.optionDescription, styles.destructiveText]}>
                                Remove todos os dados do cliente permanentemente.
                                Esta ação não pode ser desfeita.
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                            disabled={loading}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
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
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '100%',
        maxWidth: 400,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 16,
    },
    customerInfo: {
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        marginBottom: 16,
    },
    customerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    customerDocument: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'monospace',
    },
    description: {
        fontSize: 14,
        color: '#666',
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
        color: '#333',
        marginBottom: 4,
    },
    optionDescription: {
        fontSize: 12,
        color: '#666',
        lineHeight: 16,
    },
    destructiveText: {
        color: '#f44336',
    },
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
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: '500',
    },
});