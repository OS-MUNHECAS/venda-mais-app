import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Alert,
    StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface Props {
    photoUri?: string;
    onPhotoSelected: (uri: string) => void;
    onPhotoRemoved: () => void;
}

export default function PhotoSelector({ photoUri, onPhotoSelected, onPhotoRemoved }: Props) {
    const pickImage = async () => {
        Alert.alert(
            'Selecionar Foto',
            'Escolha a origem da foto:',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Câmera', onPress: () => openCamera() },
                { text: 'Galeria', onPress: () => openGallery() },
            ]
        );
    };

    const openCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão Necessária', 'É necessário permitir o acesso à câmera para continuar.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            onPhotoSelected(result.assets[0].uri);
        }
    };

    const openGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão Necessária', 'É necessário permitir o acesso à galeria para continuar.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            onPhotoSelected(result.assets[0].uri);
        }
    };

    const removePhoto = () => {
        Alert.alert(
            'Remover Foto',
            'Confirma a remoção da foto do cliente?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Confirmar', style: 'destructive', onPress: onPhotoRemoved },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Foto do Cliente</Text>

            {photoUri ? (
                <View style={styles.photoContainer}>
                    <Image source={{ uri: photoUri }} style={styles.photo} />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.changeButton} onPress={pickImage}>
                            <Text style={styles.buttonText}>📷 Alterar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.removeButton} onPress={removePhoto}>
                            <Text style={styles.removeButtonText}>Remover</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
                    <Text style={styles.addPhotoIcon}>📷</Text>
                    <Text style={styles.addPhotoText}>Adicionar Foto</Text>
                    <Text style={styles.addPhotoSubtext}>Câmera ou Galeria</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 8,
    },
    photoContainer: {
        alignItems: 'center',
    },
    photo: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F3F4F6',
        marginBottom: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    changeButton: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 6,
    },
    removeButton: {
        backgroundColor: '#DC2626',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 6,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    removeButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    addPhotoButton: {
        backgroundColor: '#FAFAFA',
        borderWidth: 2,
        borderColor: '#D1D5DB',
        borderStyle: 'dashed',
        borderRadius: 8,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120,
    },
    addPhotoIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    addPhotoText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    addPhotoSubtext: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
    },
});