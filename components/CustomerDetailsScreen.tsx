import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Linking,
    ScrollView,
    Share,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Customer } from '../app/(tabs)/types/customer';
import { useTheme } from '../contexts/ThemeContext';
import { CustomerService } from '../services/customer.service';

interface Props {
    customerId: number;
    onEdit: () => void;
    onDelete: () => void;
    onClose: () => void;
}

export default function CustomerDetailsScreen({ customerId, onEdit, onDelete, onClose }: Props) {
    const { theme } = useTheme();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCustomer();
    }, [customerId]);

    const loadCustomer = async () => {
        try {
            setLoading(true);
            const customerData = await CustomerService.getById(customerId);
            setCustomer(customerData);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar os dados do cliente');
        } finally {
            setLoading(false);
        }
    };

    const handleCall = (phone: string) => {
        const phoneNumber = phone.replace(/\D/g, '');
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const handleWhatsApp = (phone: string) => {
        const phoneNumber = phone.replace(/\D/g, '');
        Linking.openURL(`whatsapp://send?phone=55${phoneNumber}`);
    };

    const handleEmail = (email: string) => {
        Linking.openURL(`mailto:${email}`);
    };

    const handleShare = async () => {
        if (!customer) return;

        try {
            const message = `
${customer.person.name}
${customer.person.person_type === 'F' ? 'CPF' : 'CNPJ'}: ${customer.person.cpf_cnpj}

Contatos:
${customer.contacts.map(contact =>
                `${contact.contact_type === 'E' ? 'Email' : contact.contact_type === 'T' ? 'Telefone' : 'WhatsApp'}: ${contact.value}`
            ).join('\n')}

${customer.addresses.length > 0 ? `
Endereços:
${customer.addresses.map(address =>
                `${address.street}, ${address.number} - ${address.neighborhood}\nCEP: ${address.cep}`
            ).join('\n\n')}` : ''}
      `.trim();

            await Share.share({
                message,
                title: `Contato - ${customer.person.name}`,
            });
        } catch (error) {
            console.error('Erro ao compartilhar:', error);
        }
    };

    const formatDate = (dateString: string | null): string => {
        if (!dateString) return 'Nunca';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const formatDateTime = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR');
    };

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Carregando dados...</Text>
            </View>
        );
    }

    if (!customer) {
        return (
            <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
                <Text style={[styles.errorText, { color: theme.error }]}>Cliente não encontrado</Text>
                <TouchableOpacity onPress={onClose} style={[styles.backButton, { backgroundColor: theme.primary }]}>
                    <Text style={[styles.backButtonText, { color: theme.buttonText }]}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={onClose} style={styles.backButton}>
                    <Text style={[styles.backButtonText, { color: theme.primary }]}>← Voltar</Text>
                </TouchableOpacity>
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>📤</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onDelete} style={[styles.actionButton, styles.deleteButton]}>
                        <Text style={styles.actionButtonText}>🗑️</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Informações Principais */}
                <View style={[styles.section, { backgroundColor: theme.card }]}>
                    <View style={styles.customerHeader}>
                        <View style={styles.customerInfo}>
                            <Text style={[styles.customerName, { color: theme.text }]}>{customer.person.name}</Text>
                            <View style={styles.badgeContainer}>
                                <View style={[
                                    styles.badge,
                                    customer.person.person_type === 'F' ? styles.physicalBadge : styles.legalBadge
                                ]}>
                                    <Text style={styles.badgeText}>
                                        {customer.person.person_type === 'F' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                                    </Text>
                                </View>
                                <View style={[
                                    styles.badge,
                                    customer.active ? styles.activeBadge : styles.inactiveBadge
                                ]}>
                                    <Text style={styles.badgeText}>
                                        {customer.active ? 'Ativo' : 'Inativo'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>
                            {customer.person.person_type === 'F' ? 'CPF' : 'CNPJ'}:
                        </Text>
                        <Text style={[styles.value, { color: theme.text }]}>{customer.person.cpf_cnpj}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Última compra:</Text>
                        <Text style={[styles.value, { color: theme.text }]}>{formatDate(customer.last_purchase)}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Cliente desde:</Text>
                        <Text style={[styles.value, { color: theme.text }]}>{formatDateTime(customer.created_at)}</Text>
                    </View>

                    {customer.observations && (
                        <View style={styles.observationsContainer}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>Observações:</Text>
                            <Text style={[styles.observations, { color: theme.text }]}>{customer.observations}</Text>
                        </View>
                    )}
                </View>

                {/* Contatos */}
                <View style={[styles.section, { backgroundColor: theme.card }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Contatos</Text>
                    {customer.contacts.length > 0 ? (
                        customer.contacts.map((contact, index) => (
                            <View key={index} style={[styles.contactItem, { borderBottomColor: theme.border, backgroundColor: theme.inputBackground }]}>
                                <View style={styles.contactInfo}>
                                    <Text style={[styles.contactType, { color: theme.textSecondary }]}>
                                        {contact.contact_type === 'E' ? '📧 Email' :
                                            contact.contact_type === 'T' ? '📞 Telefone' : '💬 WhatsApp'}
                                    </Text>
                                    <Text style={[styles.contactValue, { color: theme.text }]}>{contact.value}</Text>
                                </View>
                                <View style={styles.contactActions}>
                                    {contact.contact_type === 'E' && (
                                        <TouchableOpacity
                                            onPress={() => handleEmail(contact.value)}
                                            style={[styles.contactButton, { backgroundColor: theme.primary }]}
                                        >
                                            <Text style={[styles.contactButtonText, { color: theme.buttonText }]}>Email</Text>
                                        </TouchableOpacity>
                                    )}
                                    {(contact.contact_type === 'T' || contact.contact_type === 'W') && (
                                        <>
                                            <TouchableOpacity
                                                onPress={() => handleCall(contact.value)}
                                                style={[styles.contactButton, { backgroundColor: theme.primary }]}
                                            >
                                                <Text style={[styles.contactButtonText, { color: theme.buttonText }]}>Ligar</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => handleWhatsApp(contact.value)}
                                                style={[styles.contactButton, { backgroundColor: '#25D366' }]}
                                            >
                                                <Text style={[styles.contactButtonText, { color: '#FFFFFF' }]}>WhatsApp</Text>
                                            </TouchableOpacity>
                                        </>
                                    )}
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Nenhum contato cadastrado</Text>
                    )}
                </View>

                {/* Endereços */}
                <View style={[styles.section, { backgroundColor: theme.card }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Endereços</Text>
                    {customer.addresses.length > 0 ? (
                        customer.addresses.map((address, index) => (
                            <View key={index} style={[styles.addressItem, { borderBottomColor: theme.border }]}>
                                <View style={styles.addressHeader}>
                                    <Text style={[styles.addressType, { color: theme.textSecondary }]}>
                                        {address.type === 'R' ? '🏠 Residencial' :
                                            address.type === 'C' ? '🏢 Comercial' : '📦 Entrega'}
                                        {address.is_main && ' (Principal)'}
                                    </Text>
                                </View>
                                <Text style={[styles.addressText, { color: theme.text }]}>
                                    {address.street}
                                    {address.number && `, ${address.number}`}
                                </Text>
                                {address.complement && (
                                    <Text style={[styles.addressText, { color: theme.text }]}>{address.complement}</Text>
                                )}
                                <Text style={[styles.addressText, { color: theme.text }]}>
                                    {address.neighborhood} - {address.city.name}/{address.city.state.acronym}
                                </Text>
                                <Text style={[styles.addressText, { color: theme.text }]}>CEP: {address.cep}</Text>
                                {address.reference && (
                                    <Text style={[styles.addressReference, { color: theme.textSecondary }]}>
                                        Referência: {address.reference}
                                    </Text>
                                )}
                            </View>
                        ))
                    ) : (
                        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Nenhum endereço cadastrado</Text>
                    )}
                </View>

                {/* Estatísticas */}
                <View style={[styles.section, { backgroundColor: theme.card }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Estatísticas</Text>
                    <View style={styles.statsGrid}>
                        <View style={[styles.statItem, { backgroundColor: theme.background }]}>
                            <Text style={[styles.statValue, { color: theme.primary }]}>{customer.contacts.length}</Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Contatos</Text>
                        </View>
                        <View style={[styles.statItem, { backgroundColor: theme.background }]}>
                            <Text style={[styles.statValue, { color: theme.primary }]}>{customer.addresses.length}</Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Endereços</Text>
                        </View>
                        <View style={[styles.statItem, { backgroundColor: theme.background }]}>
                            <Text style={[styles.statValue, { color: theme.primary }]}>
                                {customer.last_purchase ? '1+' : '0'}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Compras</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center' as const,
    },
    header: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        padding: 16,
        backgroundColor: '#2196F3',
        paddingTop: 50,
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500' as const,
    },
    headerActions: {
        flexDirection: 'row' as const,
        gap: 8,
    },
    actionButton: {
        padding: 8,
        borderRadius: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    deleteButton: {
        backgroundColor: 'rgba(244,67,54,0.8)',
    },
    actionButtonText: {
        fontSize: 16,
        color: 'white',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    customerHeader: {
        marginBottom: 16,
    },
    customerInfo: {
        flex: 1,
    },
    customerName: {
        fontSize: 24,
        fontWeight: 'bold' as const,
        color: '#333',
        marginBottom: 12,
    },
    badgeContainer: {
        flexDirection: 'row' as const,
        gap: 8,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    physicalBadge: {
        backgroundColor: '#e3f2fd',
    },
    legalBadge: {
        backgroundColor: '#f3e5f5',
    },
    activeBadge: {
        backgroundColor: '#e8f5e8',
    },
    inactiveBadge: {
        backgroundColor: '#ffebee',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '500' as const,
        color: '#333',
    },
    infoRow: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    label: {
        fontSize: 14,
        fontWeight: '500' as const,
        color: '#666',
    },
    value: {
        fontSize: 14,
        color: '#333',
        fontWeight: '400' as const,
    },
    observationsContainer: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
    },
    observations: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold' as const,
        color: '#333',
        marginBottom: 16,
    },
    contactItem: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        padding: 12,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        marginBottom: 8,
    },
    contactInfo: {
        flex: 1,
    },
    contactType: {
        fontSize: 14,
        fontWeight: '500' as const,
        color: '#666',
        marginBottom: 4,
    },
    contactValue: {
        fontSize: 16,
        color: '#333',
    },
    contactActions: {
        flexDirection: 'row' as const,
        gap: 8,
    },
    contactButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#2196F3',
        borderRadius: 6,
    },
    contactButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500' as const,
    },
    whatsappButton: {
        backgroundColor: '#25D366',
    },
    whatsappButtonText: {
        color: 'white',
    },
    addressItem: {
        padding: 12,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        marginBottom: 8,
    },
    addressHeader: {
        marginBottom: 8,
    },
    addressType: {
        fontSize: 14,
        fontWeight: '500' as const,
        color: '#2196F3',
    },
    addressText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 2,
    },
    addressReference: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic' as const,
        marginTop: 4,
    },
    emptyText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center' as const,
        fontStyle: 'italic' as const,
        padding: 20,
    },
    statsGrid: {
        flexDirection: 'row' as const,
        justifyContent: 'space-around' as const,
    },
    statItem: {
        alignItems: 'center' as const,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold' as const,
        color: '#2196F3',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
};