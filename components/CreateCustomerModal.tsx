import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { AddressFormData } from '../app/(tabs)/types/address';
import { ContactFormData } from '../app/(tabs)/types/customer';
import { useTheme } from '../contexts/ThemeContext';
import { CustomerService } from '../services/customer.service';
import { ViaCEPService } from '../services/viacep.service';
import PhotoSelector from './PhotoSelector';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateCustomerModal({ visible, onClose, onSuccess }: Props) {
    const { theme } = useTheme();
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
                style={{ flex: 1, backgroundColor: theme.background }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={[styles.container, { backgroundColor: theme.background }]}>
                    <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                        <Text style={[styles.title, { color: theme.text }]}>Novo Cliente</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={[styles.closeButtonText, { color: theme.textSecondary }]}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={[styles.content, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
                        {/* Dados Pessoais */}
                        <View style={[styles.section, { backgroundColor: theme.card }]}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>Dados Pessoais</Text>

                            {/* Seletor de Foto */}
                            <PhotoSelector
                                photoUri={photoUri}
                                onPhotoSelected={setPhotoUri}
                                onPhotoRemoved={() => setPhotoUri('')}
                            />

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: theme.text }]}>Nome *</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
                                    value={formData.name}
                                    onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                                    placeholder="Nome completo"
                                    placeholderTextColor={theme.inputPlaceholder}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: theme.text }]}>Tipo de Pessoa *</Text>
                                <View style={styles.radioGroup}>
                                    <TouchableOpacity
                                        style={[styles.radioOption, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }, formData.person_type === 'F' && { backgroundColor: theme.primary, borderColor: theme.primary }]}
                                        onPress={() => handlePersonTypeChange('F')}
                                    >
                                        <Text style={[styles.radioText, { color: theme.text }, formData.person_type === 'F' && { color: theme.buttonText }]}>
                                            Pessoa Física
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.radioOption, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }, formData.person_type === 'J' && { backgroundColor: theme.primary, borderColor: theme.primary }]}
                                        onPress={() => handlePersonTypeChange('J')}
                                    >
                                        <Text style={[styles.radioText, { color: theme.text }, formData.person_type === 'J' && { color: theme.buttonText }]}>
                                            Pessoa Jurídica
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: theme.text }]}>
                                    {formData.person_type === 'F' ? 'CPF' : 'CNPJ'} *
                                </Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
                                    value={formData.cpf_cnpj}
                                    onChangeText={handleDocumentChange}
                                    placeholder={formData.person_type === 'F' ? '000.000.000-00' : '00.000.000/0000-00'}
                                    placeholderTextColor={theme.textSecondary}
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: theme.text }]}>Observações</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
                                    value={formData.observations}
                                    onChangeText={(text) => setFormData(prev => ({ ...prev, observations: text }))}
                                    placeholder="Observações sobre o cliente"
                                    placeholderTextColor={theme.textSecondary}
                                    multiline
                                    numberOfLines={3}
                                />
                            </View>

                            <View style={styles.switchGroup}>
                                <Text style={[styles.label, { color: theme.text }]}>Cliente Ativo</Text>
                                <Switch
                                    value={formData.active}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, active: value }))}
                                    trackColor={{ false: theme.inputBorder, true: theme.primary }}
                                    thumbColor={formData.active ? theme.buttonText : theme.textSecondary}
                                />
                            </View>
                        </View>

                        {/* Contatos */}
                        <View style={[styles.section, { backgroundColor: theme.card }]}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: theme.text }]}>Contatos</Text>
                                <TouchableOpacity onPress={addContact} style={[styles.addButton, { backgroundColor: theme.primary }]}>
                                    <Text style={[styles.addButtonText, { color: theme.buttonText }]}>+ Adicionar</Text>
                                </TouchableOpacity>
                            </View>

                            {contacts.map((contact, index) => (
                                <View key={index} style={styles.contactRow}>
                                    <View style={styles.contactTypeContainer}>
                                        <TouchableOpacity
                                            style={[styles.contactTypeButton, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }, contact.contact_type === 'E' && { backgroundColor: theme.primary, borderColor: theme.primary }]}
                                            onPress={() => updateContact(index, 'contact_type', 'E')}
                                        >
                                            <Text style={[styles.contactTypeText, { color: theme.text }, contact.contact_type === 'E' && { color: theme.buttonText }]}>
                                                Email
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.contactTypeButton, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }, contact.contact_type === 'T' && { backgroundColor: theme.primary, borderColor: theme.primary }]}
                                            onPress={() => updateContact(index, 'contact_type', 'T')}
                                        >
                                            <Text style={[styles.contactTypeText, { color: theme.text }, contact.contact_type === 'T' && { color: theme.buttonText }]}>
                                                Telefone
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.contactTypeButton, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }, contact.contact_type === 'W' && { backgroundColor: theme.primary, borderColor: theme.primary }]}
                                            onPress={() => updateContact(index, 'contact_type', 'W')}
                                        >
                                            <Text style={[styles.contactTypeText, { color: theme.text }, contact.contact_type === 'W' && { color: theme.buttonText }]}>
                                                WhatsApp
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <TextInput
                                        style={[styles.input, styles.contactInput, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
                                        value={contact.value}
                                        onChangeText={(text) => updateContact(index, 'value', text)}
                                        placeholder={
                                            contact.contact_type === 'E' ? 'email@exemplo.com' :
                                                contact.contact_type === 'T' ? '(00) 0000-0000' : '(00) 90000-0000'
                                        }
                                        placeholderTextColor={theme.inputPlaceholder}
                                        keyboardType={contact.contact_type === 'E' ? 'email-address' : 'phone-pad'}
                                    />
                                    {contacts.length > 1 && (
                                        <TouchableOpacity onPress={() => removeContact(index)} style={[styles.removeButton, { backgroundColor: theme.error }]}>
                                            <Text style={[styles.removeButtonText, { color: theme.buttonText }]}>✕</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))}
                        </View>

                        {/* Endereços */}
                        <View style={[styles.section, { backgroundColor: theme.card }]}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: theme.text }]}>Endereços</Text>
                                <TouchableOpacity
                                    onPress={() => setShowAddressForm(!showAddressForm)}
                                    style={[styles.addButton, { backgroundColor: theme.primary }]}
                                >
                                    <Text style={[styles.addButtonText, { color: theme.buttonText }]}>+ Adicionar</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Lista de endereços adicionados */}
                            {addresses.map((address, index) => (
                                <View key={index} style={[styles.addressCard, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}>
                                    <View style={styles.addressInfo}>
                                        <Text style={[styles.addressText, { color: theme.text }]}>
                                            {address.street}, {address.number}
                                        </Text>
                                        <Text style={[styles.addressText, { color: theme.text }]}>
                                            {address.neighborhood} - CEP: {address.cep}
                                        </Text>
                                        <Text style={[styles.addressType, { color: theme.textSecondary }]}>
                                            {address.type === 'R' ? 'Residencial' : address.type === 'C' ? 'Comercial' : 'Entrega'}
                                            {address.is_main && ' (Principal)'}
                                        </Text>
                                    </View>
                                    <TouchableOpacity onPress={() => removeAddress(index)} style={[styles.removeButton, { backgroundColor: theme.error }]}>
                                        <Text style={[styles.removeButtonText, { color: theme.buttonText }]}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}

                            {/* Formulário de endereço */}
                            {showAddressForm && (
                                <View style={[styles.addressForm, { backgroundColor: theme.background, borderColor: theme.border }]}>
                                    <View style={styles.inputGroup}>
                                        <Text style={[styles.label, { color: theme.text }]}>CEP *</Text>
                                        <TextInput
                                            style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
                                            value={currentAddress.cep}
                                            onChangeText={(text) => {
                                                const formatted = ViaCEPService.formatCEP(text);
                                                setCurrentAddress(prev => ({ ...prev, cep: formatted }));
                                                handleCEPSearch(formatted);
                                            }}
                                            placeholder="00000-000"
                                            placeholderTextColor={theme.textSecondary}
                                            keyboardType="numeric"
                                        />
                                        {loadingCEP && <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Buscando...</Text>}
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={[styles.label, { color: theme.text }]}>Logradouro *</Text>
                                        <TextInput
                                            style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
                                            value={currentAddress.street}
                                            onChangeText={(text) => setCurrentAddress(prev => ({ ...prev, street: text }))}
                                            placeholder="Rua, Avenida, etc."
                                            placeholderTextColor={theme.textSecondary}
                                        />
                                    </View>

                                    <View style={styles.row}>
                                        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                            <Text style={[styles.label, { color: theme.text }]}>Número</Text>
                                            <TextInput
                                                style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
                                                value={currentAddress.number}
                                                onChangeText={(text) => setCurrentAddress(prev => ({ ...prev, number: text }))}
                                                placeholder="123"
                                                placeholderTextColor={theme.textSecondary}
                                            />
                                        </View>
                                        <View style={[styles.inputGroup, { flex: 2 }]}>
                                            <Text style={[styles.label, { color: theme.text }]}>Complemento</Text>
                                            <TextInput
                                                style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
                                                value={currentAddress.complement}
                                                onChangeText={(text) => setCurrentAddress(prev => ({ ...prev, complement: text }))}
                                                placeholder="Apto, Bloco, etc."
                                                placeholderTextColor={theme.textSecondary}
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={[styles.label, { color: theme.text }]}>Bairro *</Text>
                                        <TextInput
                                            style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
                                            value={currentAddress.neighborhood}
                                            onChangeText={(text) => setCurrentAddress(prev => ({ ...prev, neighborhood: text }))}
                                            placeholder="Nome do bairro"
                                            placeholderTextColor={theme.textSecondary}
                                        />
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={[styles.label, { color: theme.text }]}>Tipo de Endereço</Text>
                                        <View style={styles.radioGroup}>
                                            <TouchableOpacity
                                                style={[styles.radioOption, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }, currentAddress.type === 'R' && { backgroundColor: theme.primary, borderColor: theme.primary }]}
                                                onPress={() => setCurrentAddress(prev => ({ ...prev, type: 'R' }))}
                                            >
                                                <Text style={[styles.radioText, { color: theme.text }, currentAddress.type === 'R' && { color: theme.buttonText }]}>
                                                    Residencial
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.radioOption, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }, currentAddress.type === 'C' && { backgroundColor: theme.primary, borderColor: theme.primary }]}
                                                onPress={() => setCurrentAddress(prev => ({ ...prev, type: 'C' }))}
                                            >
                                                <Text style={[styles.radioText, { color: theme.text }, currentAddress.type === 'C' && { color: theme.buttonText }]}>
                                                    Comercial
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={styles.switchGroup}>
                                        <Text style={[styles.label, { color: theme.text }]}>Endereço Principal</Text>
                                        <Switch
                                            value={currentAddress.is_main}
                                            onValueChange={(value) => setCurrentAddress(prev => ({ ...prev, is_main: value }))}
                                            trackColor={{ false: theme.inputBorder, true: theme.primary }}
                                            thumbColor={currentAddress.is_main ? theme.buttonText : theme.textSecondary}
                                        />
                                    </View>

                                    <TouchableOpacity onPress={addAddress} style={[styles.addAddressButton, { backgroundColor: theme.primary }]}>
                                        <Text style={[styles.addAddressButtonText, { color: theme.buttonText }]}>Adicionar Endereço</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </ScrollView>

                    <View style={[styles.footer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
                        <TouchableOpacity
                            onPress={onClose}
                            style={[styles.button, styles.cancelButton, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}
                            disabled={loading}
                        >
                            <Text style={[styles.cancelButtonText, { color: theme.text }]}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSubmit}
                            style={[styles.button, styles.submitButton, { backgroundColor: theme.primary }]}
                            disabled={loading}
                        >
                            <Text style={[styles.submitButtonText, { color: theme.buttonText }]}>
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