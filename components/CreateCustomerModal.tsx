import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Switch,
} from 'react-native';
import { ContactFormData } from '../app/(tabs)/types/customer';
import { CustomerService } from '../services/customer.service';
import { ViaCEPService } from '../services/viacep.service';
import { AddressFormData } from '../app/(tabs)/types/address';
import PhotoSelector from './PhotoSelector';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateCustomerModal({ visible, onClose, onSuccess }: Props) {
    // Estados do formulário
    const [formData, setFormData] = useState({
        name: '',
        person_type: 'F' as 'F' | 'J',
        cpf_cnpj: '',
        observations: '',
        active: true,
    });

    const [photoUri, setPhotoUri] = useState<string>('');

    const [contacts, setContacts] = useState<ContactFormData[]>([
        { contact_type: 'E', value: '' }
    ]);

    const [addresses, setAddresses] = useState<AddressFormData[]>([]);
    const [currentAddress, setCurrentAddress] = useState<AddressFormData>({
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city_id: 1, // Default para uma cidade
        reference: '',
        type: 'R',
        is_main: true,
    });

    const [loading, setLoading] = useState(false);
    const [loadingCEP, setLoadingCEP] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);

    // Funções auxiliares
    const formatDocument = (value: string, type: 'F' | 'J') => {
        return CustomerService.formatDocument(value, type);
    };

    const handleDocumentChange = (value: string) => {
        const cleaned = CustomerService.cleanDocument(value);
        setFormData(prev => ({
            ...prev,
            cpf_cnpj: formatDocument(cleaned, prev.person_type)
        }));
    };

    const handlePersonTypeChange = (type: 'F' | 'J') => {
        const cleaned = CustomerService.cleanDocument(formData.cpf_cnpj);
        setFormData(prev => ({
            ...prev,
            person_type: type,
            cpf_cnpj: formatDocument(cleaned, type)
        }));
    };

    const addContact = () => {
        setContacts(prev => [...prev, { contact_type: 'T', value: '' }]);
    };

    const removeContact = (index: number) => {
        if (contacts.length > 1) {
            setContacts(prev => prev.filter((_, i) => i !== index));
        }
    };

    const updateContact = (index: number, field: keyof typeof contacts[0], value: string) => {
        setContacts(prev => prev.map((contact, i) =>
            i === index ? { ...contact, [field]: value } : contact
        ));
    };

    // Função para buscar CEP
    const handleCEPSearch = async (cep: string) => {
        if (cep.length === 9) { // CEP formatado: xxxxx-xxx
            setLoadingCEP(true);
            try {
                const result = await ViaCEPService.searchByCEP(cep);
                if (result) {
                    setCurrentAddress(prev => ({
                        ...prev,
                        cep: ViaCEPService.formatCEP(result.cep),
                        street: result.logradouro,
                        neighborhood: result.bairro,
                        // city_id seria consultado baseado no result.localidade e result.uf
                    }));
                } else {
                    Alert.alert('CEP não encontrado', 'Verifique o CEP digitado');
                }
            } catch (error) {
                Alert.alert('Erro', 'Não foi possível consultar o CEP');
            } finally {
                setLoadingCEP(false);
            }
        }
    };

    const addAddress = () => {
        if (currentAddress.cep && currentAddress.street && currentAddress.neighborhood) {
            setAddresses(prev => [...prev, currentAddress]);
            setCurrentAddress({
                cep: '',
                street: '',
                number: '',
                complement: '',
                neighborhood: '',
                city_id: 1,
                reference: '',
                type: 'R',
                is_main: false,
            });
            setShowAddressForm(false);
        } else {
            Alert.alert('Erro', 'Preencha os campos obrigatórios do endereço');
        }
    };

    const removeAddress = (index: number) => {
        setAddresses(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            // Validações básicas
            if (!formData.name.trim()) {
                Alert.alert('Erro', 'Nome é obrigatório');
                return;
            }

            if (!formData.cpf_cnpj.trim()) {
                Alert.alert('Erro', 'CPF/CNPJ é obrigatório');
                return;
            }

            // Filtra contatos válidos
            const validContacts = contacts.filter(contact => contact.value.trim());
            if (validContacts.length === 0) {
                Alert.alert('Erro', 'Pelo menos um contato é obrigatório');
                return;
            }

            await CustomerService.create({
                ...formData,
                contacts: validContacts,
                addresses: addresses,
                photo_uri: photoUri || undefined,
            });

            Alert.alert('Cliente Cadastrado', 'O cliente foi cadastrado com sucesso.', [
                {
                    text: 'Continuar', onPress: () => {
                        resetForm();
                        onSuccess();
                        onClose();
                    }
                }
            ]);
        } catch (error) {
            Alert.alert('Erro no Cadastro', error instanceof Error ? error.message : 'Não foi possível cadastrar o cliente.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            person_type: 'F',
            cpf_cnpj: '',
            observations: '',
            active: true,
        });
        setContacts([{ contact_type: 'E', value: '' }]);
        setAddresses([]);
        setPhotoUri('');
        setCurrentAddress({
            cep: '',
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            city_id: 1,
            reference: '',
            type: 'R',
            is_main: true,
        });
        setShowAddressForm(false);
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Novo Cliente</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Dados Pessoais */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Dados Pessoais</Text>

                            {/* Seletor de Foto */}
                            <PhotoSelector 
                                photoUri={photoUri}
                                onPhotoSelected={setPhotoUri}
                                onPhotoRemoved={() => setPhotoUri('')}
                            />

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Nome *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.name}
                                    onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                                    placeholder="Nome completo"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Tipo de Pessoa *</Text>
                                <View style={styles.radioGroup}>
                                    <TouchableOpacity
                                        style={[styles.radioOption, formData.person_type === 'F' && styles.radioSelected]}
                                        onPress={() => handlePersonTypeChange('F')}
                                    >
                                        <Text style={[styles.radioText, formData.person_type === 'F' && styles.radioTextSelected]}>
                                            Pessoa Física
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.radioOption, formData.person_type === 'J' && styles.radioSelected]}
                                        onPress={() => handlePersonTypeChange('J')}
                                    >
                                        <Text style={[styles.radioText, formData.person_type === 'J' && styles.radioTextSelected]}>
                                            Pessoa Jurídica
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>
                                    {formData.person_type === 'F' ? 'CPF' : 'CNPJ'} *
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.cpf_cnpj}
                                    onChangeText={handleDocumentChange}
                                    placeholder={formData.person_type === 'F' ? '000.000.000-00' : '00.000.000/0000-00'}
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Observações</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    value={formData.observations}
                                    onChangeText={(text) => setFormData(prev => ({ ...prev, observations: text }))}
                                    placeholder="Observações sobre o cliente"
                                    multiline
                                    numberOfLines={3}
                                />
                            </View>

                            <View style={styles.switchGroup}>
                                <Text style={styles.label}>Cliente Ativo</Text>
                                <Switch
                                    value={formData.active}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, active: value }))}
                                />
                            </View>
                        </View>

                        {/* Contatos */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Contatos</Text>
                                <TouchableOpacity onPress={addContact} style={styles.addButton}>
                                    <Text style={styles.addButtonText}>+ Adicionar</Text>
                                </TouchableOpacity>
                            </View>

                            {contacts.map((contact, index) => (
                                <View key={index} style={styles.contactRow}>
                                    <View style={styles.contactTypeContainer}>
                                        <TouchableOpacity
                                            style={[styles.contactTypeButton, contact.contact_type === 'E' && styles.contactTypeSelected]}
                                            onPress={() => updateContact(index, 'contact_type', 'E')}
                                        >
                                            <Text style={[styles.contactTypeText, contact.contact_type === 'E' && styles.contactTypeTextSelected]}>
                                                Email
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.contactTypeButton, contact.contact_type === 'T' && styles.contactTypeSelected]}
                                            onPress={() => updateContact(index, 'contact_type', 'T')}
                                        >
                                            <Text style={[styles.contactTypeText, contact.contact_type === 'T' && styles.contactTypeTextSelected]}>
                                                Telefone
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.contactTypeButton, contact.contact_type === 'W' && styles.contactTypeSelected]}
                                            onPress={() => updateContact(index, 'contact_type', 'W')}
                                        >
                                            <Text style={[styles.contactTypeText, contact.contact_type === 'W' && styles.contactTypeTextSelected]}>
                                                WhatsApp
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <TextInput
                                        style={[styles.input, styles.contactInput]}
                                        value={contact.value}
                                        onChangeText={(text) => updateContact(index, 'value', text)}
                                        placeholder={
                                            contact.contact_type === 'E' ? 'email@exemplo.com' :
                                                contact.contact_type === 'T' ? '(00) 0000-0000' : '(00) 90000-0000'
                                        }
                                        keyboardType={contact.contact_type === 'E' ? 'email-address' : 'phone-pad'}
                                    />
                                    {contacts.length > 1 && (
                                        <TouchableOpacity onPress={() => removeContact(index)} style={styles.removeButton}>
                                            <Text style={styles.removeButtonText}>✕</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))}
                        </View>

                        {/* Endereços */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Endereços</Text>
                                <TouchableOpacity
                                    onPress={() => setShowAddressForm(!showAddressForm)}
                                    style={styles.addButton}
                                >
                                    <Text style={styles.addButtonText}>+ Adicionar</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Lista de endereços adicionados */}
                            {addresses.map((address, index) => (
                                <View key={index} style={styles.addressCard}>
                                    <View style={styles.addressInfo}>
                                        <Text style={styles.addressText}>
                                            {address.street}, {address.number}
                                        </Text>
                                        <Text style={styles.addressText}>
                                            {address.neighborhood} - CEP: {address.cep}
                                        </Text>
                                        <Text style={styles.addressType}>
                                            {address.type === 'R' ? 'Residencial' : address.type === 'C' ? 'Comercial' : 'Entrega'}
                                            {address.is_main && ' (Principal)'}
                                        </Text>
                                    </View>
                                    <TouchableOpacity onPress={() => removeAddress(index)} style={styles.removeButton}>
                                        <Text style={styles.removeButtonText}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}

                            {/* Formulário de endereço */}
                            {showAddressForm && (
                                <View style={styles.addressForm}>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>CEP *</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={currentAddress.cep}
                                            onChangeText={(text) => {
                                                const formatted = ViaCEPService.formatCEP(text);
                                                setCurrentAddress(prev => ({ ...prev, cep: formatted }));
                                                handleCEPSearch(formatted);
                                            }}
                                            placeholder="00000-000"
                                            keyboardType="numeric"
                                        />
                                        {loadingCEP && <Text style={styles.loadingText}>Buscando...</Text>}
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Logradouro *</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={currentAddress.street}
                                            onChangeText={(text) => setCurrentAddress(prev => ({ ...prev, street: text }))}
                                            placeholder="Rua, Avenida, etc."
                                        />
                                    </View>

                                    <View style={styles.row}>
                                        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                            <Text style={styles.label}>Número</Text>
                                            <TextInput
                                                style={styles.input}
                                                value={currentAddress.number}
                                                onChangeText={(text) => setCurrentAddress(prev => ({ ...prev, number: text }))}
                                                placeholder="123"
                                            />
                                        </View>
                                        <View style={[styles.inputGroup, { flex: 2 }]}>
                                            <Text style={styles.label}>Complemento</Text>
                                            <TextInput
                                                style={styles.input}
                                                value={currentAddress.complement}
                                                onChangeText={(text) => setCurrentAddress(prev => ({ ...prev, complement: text }))}
                                                placeholder="Apto, Bloco, etc."
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Bairro *</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={currentAddress.neighborhood}
                                            onChangeText={(text) => setCurrentAddress(prev => ({ ...prev, neighborhood: text }))}
                                            placeholder="Nome do bairro"
                                        />
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Tipo de Endereço</Text>
                                        <View style={styles.radioGroup}>
                                            <TouchableOpacity
                                                style={[styles.radioOption, currentAddress.type === 'R' && styles.radioSelected]}
                                                onPress={() => setCurrentAddress(prev => ({ ...prev, type: 'R' }))}
                                            >
                                                <Text style={[styles.radioText, currentAddress.type === 'R' && styles.radioTextSelected]}>
                                                    Residencial
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.radioOption, currentAddress.type === 'C' && styles.radioSelected]}
                                                onPress={() => setCurrentAddress(prev => ({ ...prev, type: 'C' }))}
                                            >
                                                <Text style={[styles.radioText, currentAddress.type === 'C' && styles.radioTextSelected]}>
                                                    Comercial
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={styles.switchGroup}>
                                        <Text style={styles.label}>Endereço Principal</Text>
                                        <Switch
                                            value={currentAddress.is_main}
                                            onValueChange={(value) => setCurrentAddress(prev => ({ ...prev, is_main: value }))}
                                        />
                                    </View>

                                    <TouchableOpacity onPress={addAddress} style={styles.addAddressButton}>
                                        <Text style={styles.addAddressButtonText}>Adicionar Endereço</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            onPress={onClose}
                            style={[styles.button, styles.cancelButton]}
                            disabled={loading}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSubmit}
                            style={[styles.button, styles.submitButton]}
                            disabled={loading}
                        >
                            <Text style={styles.submitButtonText}>
                                {loading ? 'Salvando...' : 'Salvar'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        padding: 16,
        backgroundColor: '#2196F3',
        paddingTop: 50,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold' as const,
        color: 'white',
    },
    closeButton: {
        padding: 8,
    },
    closeButtonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold' as const,
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold' as const,
        color: '#333',
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500' as const,
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: 'white',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top' as const,
    },
    radioGroup: {
        flexDirection: 'row' as const,
        gap: 8,
    },
    radioOption: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        alignItems: 'center' as const,
    },
    radioSelected: {
        borderColor: '#2196F3',
        backgroundColor: '#e3f2fd',
    },
    radioText: {
        fontSize: 14,
        color: '#666',
    },
    radioTextSelected: {
        color: '#2196F3',
        fontWeight: '500' as const,
    },
    switchGroup: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        marginBottom: 8,
    },
    addButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#2196F3',
        borderRadius: 6,
    },
    addButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500' as const,
    },
    contactRow: {
        marginBottom: 12,
    },
    contactTypeContainer: {
        flexDirection: 'row' as const,
        marginBottom: 8,
        gap: 4,
    },
    contactTypeButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        alignItems: 'center' as const,
    },
    contactTypeSelected: {
        borderColor: '#2196F3',
        backgroundColor: '#e3f2fd',
    },
    contactTypeText: {
        fontSize: 12,
        color: '#666',
    },
    contactTypeTextSelected: {
        color: '#2196F3',
        fontWeight: '500' as const,
    },
    contactInput: {
        flex: 1,
    },
    removeButton: {
        position: 'absolute' as const,
        right: 8,
        top: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#f44336',
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    },
    removeButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold' as const,
    },
    addressCard: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'flex-start' as const,
        padding: 12,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        marginBottom: 8,
    },
    addressInfo: {
        flex: 1,
    },
    addressText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    addressType: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic' as const,
    },
    addressForm: {
        marginTop: 12,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    row: {
        flexDirection: 'row' as const,
    },
    loadingText: {
        fontSize: 12,
        color: '#2196F3',
        marginTop: 4,
    },
    addAddressButton: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center' as const,
        marginTop: 8,
    },
    addAddressButtonText: {
        color: 'white',
        fontWeight: '500' as const,
    },
    footer: {
        flexDirection: 'row' as const,
        padding: 16,
        gap: 12,
        backgroundColor: 'white',
    },
    button: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center' as const,
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: '500' as const,
    },
    submitButton: {
        backgroundColor: '#2196F3',
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold' as const,
    },
};